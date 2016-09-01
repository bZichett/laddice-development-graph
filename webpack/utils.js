var fs = require('fs')
var path = require('path')


module.exports.getProductionVersion = function (versions) {
	return findByMatchingProperties(versions, {production: true})[0]
}


function makeManifestPath(manifestProps){
	return path.resolve(manifestProps.location, manifestProps.name + '.json')
}

module.exports.makeManifestPath = makeManifestPath


module.exports.getManifest = function (manifestFilePath) {
	return JSON.parse(fs.readFileSync(manifestFilePath, 'utf8'))
}

module.exports.setupDirs = function (dir) {

	var versionManifestPath = makeManifestPath(dir.manifest.versions)
	var devManifestPath = makeManifestPath(dir.manifest.development)

	/** Build directory */
	if (!fs.existsSync(dir.dist)) fs.mkdirSync(dir.dist);

	/** Versions directory */
	if (!fs.existsSync(dir.release)) {
		fs.mkdirSync(dir.release)
	}

	/** Development directory */
	if (!fs.existsSync(dir.development))             fs.mkdirSync(dir.development)
	if (!fs.existsSync(dir.development + '/js'))     fs.mkdirSync(dir.development + '/js')
	if (!fs.existsSync(dir.development + '/css'))    fs.mkdirSync(dir.development + '/css')
	//if (!fs.existsSync(dir.development + '/vendor')) fs.mkdirSync(dir.development + '/vendor')

	/** Development manifest*/
	if (!fs.existsSync(devManifestPath)) {
		fs.writeFileSync(devManifestPath, JSON.stringify({}))
	}

	/** Version manifest */
	if (!fs.existsSync(versionManifestPath)) fs.writeFileSync(versionManifestPath, JSON.stringify([]))

	return {versions: versionManifestPath, devVersion: devManifestPath}

}

module.exports.printDate = function () {

	var date = new Date();
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	var h = date.getHours();
	var m = date.getMinutes();

	return monthIndex + 1 + "/" + day + "/" + year + ", " + h + ":" + m
}

module.exports.getNextVersion = function (id, upgradeType) {
	var v = id.split('.')
	switch (upgradeType) {
		case 'patch':
			v[2] = parseInt(v[2]) + 1
			break
		case 'minor':
			v[1] = parseInt(v[1]) + 1
			v[2] = 0
			break
		case 'major':
			v[0] = parseInt(v[0]) + 1
			v[1] = 0
			v[2] = 0
			break
	}

	return v.join('.')
}

function findByMatchingProperties(array, properties) {
	return array.filter(function (entry) {
		return Object.keys(properties).every(function (key) {
			return entry[key] === properties[key];
		});
	});

}

module.exports.findByMatchingProperties = findByMatchingProperties
