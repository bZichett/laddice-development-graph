var path = require('path');
var webpack = require('webpack');
var args = require('yargs').argv;
var colors = require('colors')

var autoprefixer = require('autoprefixer');
var paths = require('../config/paths');

module.exports = function (env) {

	global.__TESTING__ = env.__TESTING__ || !!args["testing"]
	global.__PROD__ = env.production || !!args["production"]
	global.__DEV__ = env.development || env.devServer || !!args["development"] || !!args['devServer']
	global.__BUILD__ = !!(__PROD__ || __DEV__);
	global.__STAGING__ = env.staging || !!args["staging"]
	global.devServer = env.devServer || !!args["devServer"]

	console.log("Build: ".yellow, (__BUILD__))
	console.log("Production Build: ".yellow, (__PROD__))
	console.log("Development Server: ".yellow, (!!devServer))
	console.log("Development Build: ".red, (__DEV__))
	console.log("Testing: ".red, (!!__TESTING__))

	const plugins = require('./config/plugins')
	const externals = require('./config/externals')
	const entry = require('./config/entry')
	const resolve = require('./config/resolve')
	const _module = require('./config/module')

	return {

		bail: __PROD__ ? true : false,
		devtool: __PROD__ ? 'source-map' : 'eval',
		entry,
		output: {
			path: paths.appBuild,
			pathinfo: true,
			//	path: path.resolve(paths.static, 'build', (__DEV__ || __PROD__) ? 'development' : ""),
			filename: __PROD__ ? 'static/js/bundle.js' : 'static/js/[name].[hash:8].js',
			chunkFilename: 'static/js/[name].[hash:8].chunk.js',
			publicPath: __PROD__ ? publicPath: '/'
		},
		resolve,
		module: _module,
		externals,
		eslint: {
			configFile: path.join(paths.config, 'eslint.js'),
			useEslintrc: false
		},
		postcss: function () {
			return [autoprefixer];
		},
		sassLoader: {
			//includePaths: paths.scss.all
		},
		plugins: require('./config/plugins')
	}
}