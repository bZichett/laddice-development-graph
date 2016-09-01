var webpack = require('webpack');
var entry = require('../config/entry')

/** Plugins */
var ExtractTextPlugin = require('extract-text-webpack-plugin')

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
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

    new webpack.ProvidePlugin({
        /** defineProperty */ defineProperty: 'imports?this=>global!exports?global.Object.defineProperty!definePropertyPolyfill',
        /** Function.bind */  bind: 'imports?this=>global!exports?global.Function.bind!bindPolyfill',
        /** Object.assign */  assign: 'imports?this=>global!exports?global.Object.assign!assignPolyfill',
        /** Object.watch */   watch: 'imports?this=>global!exports?global.Object.watch!watchPolyfill'

    }),

    new webpack.DefinePlugin({
        __PROD__: __PROD__,
        __DEV__: __DEV__,
        __BUILD__: __PROD__ || __DEV__,
        devServer: devServer,
        __TESTING__: __TESTING__
    })
]

.concat(!__TESTING__ ? [
    extractCSS,
] : [])
.concat(__PROD__ ?
    [
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
