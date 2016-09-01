/** DIRECTORY AND FILES */
var rimraf = require('rimraf')
var copy = require('directory-copy')
var fs = require('fs')
var path = require('path')
var PATHS = require('./paths')

/** UTILITIES */
var utils = require('./utils')
var getNextVersion = utils.getNextVersion
var printDate = utils.printDate
var getProductionVersion = utils.getProductionVersion
var setupDirs = utils.setupDirs
var getManifest = utils.getManifest

/** MISC. */
var getGitBranchName = require('git-branch-name')
const md5ify = require('md5ify')
var argv = require('yargs').argv;
//var generate = require('project-name-generator')
var codename = require('codename-add-words')()
var Q = require('q');

/** Steps
 1) Produce temporary build
 2) Compare hash of all files in development build to last production versions files
 3) If different, then replace, else insert unmodified reference to module version
 4) Build new version with the most recent references
 */

var copyFileSync = function(srcFile, destFile, encoding) {
	var content = fs.readFileSync(srcFile, encoding);
	fs.writeFileSync(destFile, content, encoding);
}

module.exports = {

    setupRelease: function (opts, PRODUCTION) {
	    var deferred = Q.defer();

	    var cssModuleNames = []
	    var updatedModules = []
	    var dir = opts.dir

	    var paths = setupDirs(dir)

	    var versionManifestPath = paths.versions
	    var devManifestPath = paths.devVersion

	    // Keep track of what past versions this build is dependent on
	    // so we can optionally purge older versions
	    var versionDependencies = []

        var DEVELOPMENT = !PRODUCTION

        var modules = opts.modules.js

	    var versions = getManifest(versionManifestPath)

	    var versionNameToIdMap = new Map()
	    versions.forEach(function(version){
		    versionNameToIdMap.set(version.name, version.id)
	    })

	    var devVersion = getManifest(devManifestPath)

        /** Find the current production entry in the manifest
         If this is a production release, toggle the production
         flag which means it'll load for end users */
        var newId

	    var latestVersion = versions[0]
	    var productionVersion = getProductionVersion(versions)
	    if (productionVersion && argv['flag'] != '')  productionVersion.production = false

        if (PRODUCTION) newId = getNextVersion(
	        latestVersion ? latestVersion.id : "0.0.0",
			argv.type != '' ? argv.type : 'patch'
		)
        else            newId = latestVersion ? latestVersion.id : "0.0.0"

        // Now create random name version name and a directory for the new version files

	    var filters = ['alliterative', 'unique', 'random'],
		    lists = ['adjectives', 'animals']

	    //var distributionName = generate().dashed
	    var distributionName = codename.generate(filters, lists).join("-").toLowerCase();

        if(PRODUCTION){
            dir.newVersionDir = path.join(dir.release, newId + "-" + distributionName)
            fs.mkdirSync(dir.newVersionDir)
            fs.mkdirSync(dir.newVersionDir + '/' + PATHS.build.dirNames.js)
            if(PATHS.build.dirNames.css != '')
                fs.mkdirSync(dir.newVersionDir + '/' + PATHS.build.dirNames.css)
        }

	    getGitBranchName(PATHS.root, function(err, branchName){

        var newVersion = {
            name: distributionName,
            id: newId,
            type: argv.type != '' ? argv.type : 'patch',
            branch: branchName,
            production: argv['flag'] != '' ? PRODUCTION : false,
            created: printDate(),
            timestamp: new Date(),
            notes: argv.notes,
            schemaChange: argv.schemaChange ? true : false,
            modules: {'js': {}, 'css': {}}
        }

	    function updateDevManifest() {
		    try {
			    newVersion.name = 'dev-' + newVersion.name
			     //devVersion.modules[bundleName][module] = 'development'
			    fs.writeFile(devManifestPath, JSON.stringify(newVersion), function (err, data) {
				    if (err) {
					    return console.log(err);
				    }
			    });

		    } catch (e) {
		    }
	    }

        if (PRODUCTION && versions.length > 0 && devVersion) {
            console.error("Old versions exist")

            /** We need to compare the modified date or hash of the last distribution module
                 with the modified date of the development module.
                By doing this, we'll collect the names
                of the most recently changed modules
             */
	        //var developmentModulesJS = fs.readdirSync(dir.dist + 'development/js');
            //var developmentModulesCSS = fs.readdirSync(dir.dist + 'development/css');

            var moduleModifiedMapJS = {}
	        var moduleModifiedMapCSS = {}

            modules.forEach(function (module) {
                //console.log(module)
                try {
	                moduleModifiedMapJS[module] =
                        md5ify(path.resolve(dir.dist, 'development', PATHS.build.dirNames.js, module + '.js'))
                } catch(e){
	                //console.error("No JS file here")
                }

	            try {
		            moduleModifiedMapCSS[module] =
                        md5ify(path.resolve(dir.dist, 'development', PATHS.build.dirNames.css, module + '.css'))
		            cssModuleNames.push(module)
	            } catch(e){
		            //console.error("No CSS file here")
	            }
            })

            // Separating vendor modules from developed src code
            //var moduleModifiedMapVendor = {}
            //var vendorModules = ['vendor']
	        //vendorModules.forEach(function (module) {
            //    var stats = fs.statSync(dir.dist + '/development/' + 'vendor' + '/' + module + '.js')
            //    moduleModifiedMapVendor[module] = stats.mtime
            //
            //})

            function compareModuleRelease(bundleDir, fileType, devModulesHash, oldVersion, newVersion) {

                //console.log(bundleDir, devModulesHash)

                var oldVersionModules = oldVersion.modules[bundleDir]
                var newVersionModules = newVersion.modules[bundleDir]
	            var oldVersionAbsPath

                var keys = Object.keys(devModulesHash)

                for (var i = 0; i < keys.length; i++) {

                    var moduleName = keys[i]
                    var devHash = devModulesHash[keys[i]]

	                var hash

                    try {

                        oldVersionAbsPath = path.resolve(
                            dir.release,
                            versionNameToIdMap.get(oldVersion.modules[bundleDir][moduleName]) + '-' + oldVersion.modules[bundleDir][moduleName],
		                    PATHS.build.dirNames[bundleDir],
                            moduleName + "." + fileType)

	                    hash = md5ify(oldVersionAbsPath)
                    } catch (e) {
	                    // A new file
	                    hash = false
                    }

                    if (devHash != hash){
	                    // File has been updated.
	                    newVersionModules[moduleName] = distributionName
	                    updatedModules.push(bundleDir + '/' + moduleName)
                        copyFileSync(
                            path.resolve(dir.development, bundleDir, moduleName + "." + fileType),
                            path.resolve(dir.newVersionDir, bundleDir, moduleName + "." + fileType))

                    }
                    else {
	                    // Copy name from older versions
	                     newVersionModules[moduleName] =
		                    oldVersionModules[moduleName] != 'development' ? oldVersionModules[moduleName] : distributionName
	                     versionDependencies.push(oldVersionModules[moduleName])
	                     //copyFileSync(
		                 //   oldVersionAbsPath,
		                 //   path.resolve(dir.newVersionDir, bundleDir, moduleName + "." + fileType))
                    }
	                    // Or ... do nothing;
	                    // and we'll collect the version name from the previous version
	                    // This is less computationally efficient though in multiple places
                        // but we should cache the application tags
                }
            }

            // Compare to most recent deployed release
            //for(var j=0; j < versionNames.length; j++){
            var oldVersion = versions[0]

            // Iterate through all distribution types starting
            // with the newest until all modules are collected
            compareModuleRelease(PATHS.build.dirNames.js, 'js', moduleModifiedMapJS, oldVersion, newVersion)
            compareModuleRelease(PATHS.build.dirNames.css, 'css', moduleModifiedMapCSS, oldVersion, newVersion)


        } else {
			if(PRODUCTION){

	            /** First production distribution */
	            modules.forEach(function(moduleName){

	                // Find last modified file.  If the development folder is more recently modified than
	                // the last found module version, replace it with the new name.
	                newVersion.modules.js[moduleName] = distributionName

		            try {
			            if(fs.readFileSync(path.resolve(dir.development, PATHS.build.dirNames['css'], moduleName + ".css")))
				            newVersion.modules.css[moduleName] = distributionName
		            } catch(e){}

	            })

				cssModuleNames.forEach(function (module) {
	                newVersion.modules.css[module] = distributionName
	            })

				// Now copy all development files to the new version
				copy({ src: path.resolve(dir.development)
						, dest: dir.newVersionDir
						, excludes: [ /^\./ ] // Exclude hidden files
					}
					, function () {
						console.log('Bulk copy from development complete')
					})

			}

        }

		if(PRODUCTION){

			// Now add the currently released version to the manifest
			versions.unshift(newVersion)

			if(versions.length == 1 || updatedModules.length > 0) {

				// Remove any older entries while ensuring
				// it has no dependencies to the current build
				// and hasn't been marked to keep
				if(opts.versionsToKeep && versions.length > opts.versionsToKeep){
					var v = Object.create(versions)
					var canDeleteVersion
					while(v.length != 0) {
						var nextOldest = v.pop()
						if(!nextOldest.keep && versionDependencies.indexOf(nextOldest.name) == -1){
							canDeleteVersion = nextOldest
							break
						}
					}

					versions.splice(versions.indexOf(canDeleteVersion), 1)
					rimraf(path.join(dir.release, canDeleteVersion.id + "-" + canDeleteVersion.name), function(err){})
				}

				// This isn't necessarily needed since we can always match the version name to the module name
				//newVersion.updatedModules = updatedModules
				console.info(("Modules updated " + updatedModules).green)

				fs.writeFile(versionManifestPath, JSON.stringify(versions), function (err, data) {
					if (err) {
						return console.error(err);
					}
				});


			}
			else {
				// No changes, delete the directory
				newVersion.noChanges = true
				rimraf(dir.newVersionDir, function(err){})
			}


		} else {
			// TODO Write to dev manifest
			updateDevManifest()
		}

        return deferred.resolve(newVersion);
	    })

	    return deferred.promise;
    }
}
