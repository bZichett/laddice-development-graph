var path = require('path');
var webpack = require('webpack');
var args = require('yargs').argv;
var colors = require('colors')

var autoprefixer = require('autoprefixer');
var paths = require('../config/paths');

module.exports = function (env) {

	global.__TESTING__ = env.__TESTING__ || !!args["testing"]
	global.__PROD__ = env.__PROD__ || !!args["production"]
	global.__DEV__ = env.__DEV__ || env.devServer || !!args["development"] || !!args['devServer']
	global.__BUILD__ = !!(__PROD__ || __DEV__);
	global.__STAGING__ = env.staging || !!args["staging"]
	global.devServer = env.devServer || !!args["devServer"]

	const publicPath = env.publicPath || '/'

	console.log("Production Build: ".yellow, (__PROD__))
	console.log("Development Build: ".red, (__DEV__))
	console.log("Development Server: ".yellow, (!!devServer))
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
			filename: __PROD__ ? 'js/bundle.js' : 'js/[name].[hash:8].js',
			chunkFilename: 'js/[name].[hash:8].chunk.js',
			publicPath
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