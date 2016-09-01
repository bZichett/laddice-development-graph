
module.exports = function (wallaby) {
	return {

		debug: true,
		maxConsoleMessagesPerTest: 100000,
		files: [
			{pattern: 'node_modules/chai/chai.js', instrument: false},
			{pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false},
			'src/**/*.js',
			{pattern: 'src/**/*.spec.js', ignore: true},
		],

		tests: [
			'src/**/*.spec.js'
		],

		env: {type: 'node'},

		testFramework: 'mocha',

		compilers: {
			//'src/**/*.js': wallaby.compilers.babel({babel: require('babel-core')})
			'**/*.js': wallaby.compilers.babel()
		},

		setup: function () {
			global.expect = require('chai').expect;
		}
	};
};