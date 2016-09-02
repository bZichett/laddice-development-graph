var webpack = require('webpack');
var paths = require('../../config/paths');

/** Plugins */
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

/** Helpers */
var colors = require('colors')

var extractCSS = new ExtractTextPlugin({
    filename: 'css/[name].css',
    publicPath: 'css',
    allChunks: true,
})

module.exports = [

    new webpack.NoErrorsPlugin(),
    new webpack.dependencies.LabeledModulesPlugin(),
    //new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    new webpack.DefinePlugin({
        __PROD__: __PROD__,
        __DEV__: __DEV__,
        __BUILD__: __PROD__ || __DEV__,
        devServer: devServer,
        __TESTING__: __TESTING__
    })
]
.concat(__DEV__ ? [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        favicon: paths.appFavicon,
    })
] : [])
.concat(__PROD__ ?
    [
        extractCSS,
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            favicon: paths.appFavicon,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),

        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
        new CopyWebpackPlugin([{ from: 'static', to: 'static' }]),
        new webpack.HashedModuleIdsPlugin(),
        //new webpack.optimize.DedupePlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: __PROD__ ? true : false,
            debug: false,
            options: {
                comments: false
            }
        })
    ] : [])
