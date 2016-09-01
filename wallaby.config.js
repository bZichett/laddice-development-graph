var path = require('path')
var webpack = require('webpack')
var wallabyWebpack = require('wallaby-webpack');

global.__TESTING__ = true

var devConfig = require('./webpack/webpack.config.dev.js')
var paths = require('./webpack/paths')

var emptyModule = path.resolve(paths.vendor, 'empty-module.js')

module.exports = function (wallaby) {

	//process.env.NODE_PATH += path.delimiter + path.resolve(wallaby.localProjectDir, 'node_modules');

	/** Webpack overrides */
	//devConfig.devtool = 'cheap-module-source-map'
	//devConfig.devtool = 'source-map'
	devConfig.devtool = 'eval'
	//delete devConfig.devtool

	var src =     path.join(wallaby.projectCacheDir, 'src')

	devConfig.resolve.modules.concat([
	])

	/** GLOBAL */
	devConfig.resolve.alias.test = paths.test.unit

	/** APPS */
	devConfig.resolve.alias.src = src

	devConfig.entryPatterns = [
		'src/app.js',
		'test/fixture.js',
		'src/**/*-test.js'
	];

	// Ignore scss
	//devConfig.plugins.push(new webpack.IgnorePlugin(/\.scss$/));
	devConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(/\.(gif|png|scss|css)$/, emptyModule))
	devConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(/^bootstrap-loader$/, emptyModule))

	//devConfig.plugins.push(new webpack.ProvidePlugin({
	//	__TESTING__: true,
	//	__DEV__    : false,
	//	__PROD__   : false,
	//}))

	// Delete babel-loader and sass-loader
	devConfig.module.loaders = devConfig.module.loaders.filter(function(l){
		return  (l['loader'] !== 'babel-loader'
			  || l['name'] !== 'sass-loader')
	});

	var wallabyPostprocessor = wallabyWebpack(devConfig);

	var babelCompiler = wallaby.compilers.babel({
		babel: require('babel-core'),
		babelrc: false,
		extends: path.resolve('./config/babel.dev.js'),
	})

	return {
		debug: false,

		files: [

		/** PLUGINS */
			{pattern: 'node_modules/babel-polyfill/polyfill.js', instrument: false},

		/** CORE MODULES */
			{pattern: 'src/**/*.js', load: false},

		/** FIXTURES */
			{pattern: 'test/fixture.js', load: false},

		/** VENDOR */
			{pattern: 'node_modules/mithril/mithril.min.js', instrument: false},
			{pattern: 'node_modules/d3/d3.min.js', instrument: false},
			//{pattern: 'node_modules/bootstrap/js/affix.js', instrument: false},
			//{pattern: 'node_modules/bootstrap/js/dropdown.js', instrument: false},
			//{pattern: 'node_modules/bootstrap/js/modal.js', instrument: false},
			//{pattern: 'node_modules/bootstrap/js/tooltip.js', instrument: false},
			//{pattern: 'node_modules/bootstrap/js/transition.js', instrument: false},
			//{pattern: 'node_modules/mousetrap/mousetrap.js', instrument: false},

		/** POLYFILLS */
			{pattern: 'node_modules/karma-phantomjs-shim/shim.js', instrument: false},
			//{pattern: 'vendor/polyfills/assign.polyfill.js', instrument: false},
			//{pattern: 'vendor/polyfills/object.create.polyfill.js', instrument: false},
			//{pattern: 'vendor/polyfills/object.keys.polyfill.js', instrument: false},
			//{pattern: 'vendor/polyfills/bind.polyfill.js', instrument: false}, // Not needed when using phantomjs2-ext?
			//{pattern: 'vendor/polyfills/watch.polyfill.js', instrument: false},

		/** TESTING */
			{pattern: '../node_modules/chai/chai.js', instrument: false},
			{pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false}, // http://sinonjs.org/
			//{pattern: '../node_modules/sinon-chai/lib/sinon-chai.js', instrument: false}, // http://chaijs.com/plugins/sinon-chai
			//{pattern: '../node_modules/chai-as-promised/lib/chai-as-promised.js', instrument: false},

		/** IGNORE */

		/** IGNORE - Tests */
			{pattern: 'src/**/*-test.js', ignore: true},

		],

		tests: [
			{pattern: 'src/**/*-test.js', load: false}
		],

		testFramework: 'mocha@2.2.4',

		env: {
			runner: require('phantomjs2-ext').path,
			params: { runner: '--web-security=false' }
		},

		compilers: {
			'src/**/*.js': babelCompiler,
		},

		postprocessor: wallabyPostprocessor,

		middleware: (app, express) => {
			app.use('/node_modules',
				express.static(path.join(__dirname, 'node_modules'))
			)
		},

		bootstrap: function () {
			var mocha = wallaby.testFramework;
			mocha.ui('bdd');
			window.HTTP_HOST  = 'http://'
			window.HOSTNAME   = 'localhost:3000/'
			window.__moduleBundler.loadTests();
		}
	}
};





//module.exports = function (wallaby) {
//	return {
//
//		debug: true,
//		maxConsoleMessagesPerTest: 100000,
//		files: [
//			{pattern: 'node_modules/chai/chai.js', instrument: false},
//			{pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false},
//			'src/**/*.js',
//			{pattern: 'src/**/*.spec.js', ignore: true},
//		],
//
//		tests: [
//			'src/**/*.spec.js'
//		],
//
//		env: {type: 'node'},
//
//		testFramework: 'mocha',
//
//		compilers: {
//			//'src/**/*.js': wallaby.compilers.babel({babel: require('babel-core')})
//			'**/*.js': wallaby.compilers.babel()
//		},
//
//		setup: function () {
//			global.expect = require('chai').expect;
//		}
//	};
//};