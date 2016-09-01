var fs = require('fs');
var path = require('path');
var paths = require('./paths');
var entry = require('./config/entry');

var splitByPath = [
    {name: 'app',           path: [paths.src + '/laddice']},
]

module.exports = {

	split: true,
	versionsToKeep: 20,
	dir: {
		dist: paths.build.root,
		release: paths.build.versions,
		development: paths.build.development,
		manifest: {
			versions: {
				location: paths.build.root,
				name: 'manifest-versions'
			},
			obsolete: {
				location: paths.build.root,
				name: 'manifest-versions-obsolete'
			},
			development: {
				location: paths.build.root,
				name: 'manifest-development'
			}
		}
	},
    splitByPath: splitByPath,
	modules: {
		js:     splitByPath.map((obj) => obj.name)
        .concat(Object.keys(entry)
        )
	}
};
