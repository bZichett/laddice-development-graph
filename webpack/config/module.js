var paths = require('../../config/paths')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

function q(loader, query) {
	return loader + "?" + JSON.stringify(query);
}

var cssLoaderQuery = {
	indentedSyntax: true,
	sourceMap: true
};

//var extractScss = ExtractTextPlugin.extract({fallbackLoader: 'style-loader',
//	loader: 'css-loader' + q('!sass-loader', cssLoaderQuery),
//	publicPath: __BUILD__ ? '../../' : '../..'
//});

var cssLoaderQuery = {
	//includePaths: paths.scss.all,
	indentedSyntax: __BUILD__ ? false : true,
	sourceMap: __BUILD__ ? false : true,
};

module.exports = {
	preLoaders: [
		{
			test: /\.js$/,
			loader: 'eslint',
			include: paths.appSrc,
		}
	],
	loaders: [
		{
			test: /\.js$/,
			include: paths.appSrc,
			loader: 'babel-loader',
			cacheDirectory: true,
			query: require(__PROD__ ? '../../config/babel.prod' : '../../config/babel.dev')
		},
		{
			test: /\.scss$/,
			include: [paths.appSrc, paths.appNodeModules],
			loaders: 'css-loader' + q('!sass-loader', cssLoaderQuery), //extractScss,
			name: 'sass-loader' // used only to easily filter this loader out for unit testing
		},
		{
			test: /\.css$/,
			include: [paths.appSrc, paths.appNodeModules],
			loader: __PROD__ ?
				ExtractTextPlugin.extract({fallbackLoader: 'style', loader: 'css?-autoprefixer!postcss'})
				: 'style!css!postcss'
		},
		{
			test: /\.json$/,
			include: [paths.appSrc, paths.appNodeModules],
			loader: 'json'
		},
		{
			test: /\.(vert|frag)$/,
			include: [paths.appSrc, paths.appNodeModules],
			loader: 'raw'
		},
		{
			test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
			include: [paths.appSrc, paths.appNodeModules],
			loaders: [
				q('file-loader', {
					hash: 'sha512',
					digest: 'hex',
					name: (__BUILD__ ? paths.build.filesConfig : paths.build.filesConfigDev)
				}),
				q('image-webpack', {
					bypassOnDebug: true,
					optimizationLevel: 7,
					interlaced: false
				})
			],
			query: {
				name: __PROD__ ? 'static/media/[name].[hash:8].[ext]' : 'static/media/[name].[ext]'
			}
		},
		{
			test: /\.(mp4|webm)(\?.*)?$/,
			include: [paths.appSrc, paths.appNodeModules],
			loader: 'url',
			query: {
				limit: 10000,
				name: __PROD__ ? 'static/media/[name].[ext]': 'static/media/[name].[hash:8].[ext]'
			}
		}
	]
}