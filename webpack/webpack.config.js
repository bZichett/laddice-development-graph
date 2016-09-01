var path = require('path');
var webpack = require('webpack');
var args = require('yargs').argv;
var colors = require('colors')

module.exports = function (env) {

    global.__TESTING__ = env.__TESTING__  || !!args["testing"]
    global.__PROD__ = env.production      || !!args["production"]
    global.__DEV__ =  env.development     || env.devServer || !!args["development"] || !!args['devServer']
    global.__BUILD__ = !!(__PROD__ || __DEV__);
    global.__STAGING__ = env.staging || !!args["staging"]
    global.devServer = env.devServer || !!args["devServer"]

    var loaders = require('./config/loaders')
    var plugins = require('./config/plugins')
    var externals = require('./config/externals')
    var entry = require('./config/entry')
    var resolve = require('./config/resolve')
    var paths = require('./paths')

    console.log("Build: ".yellow, (__BUILD__))
    console.log("Production Build: ".yellow, (__PROD__))
    console.log("Development Server: ".yellow, (!!devServer))
    console.log("Development Build: ".red, (__DEV__))
    console.log("Testing: ".red, (!!__TESTING__))

    return {

        entry: entry,
        externals: externals,
        output: {
            path: path.resolve(paths.static, 'build', (__DEV__ || __PROD__) ? 'development' : ""),
            publicPath: '',
            filename: "js/[name].js",
            chunkFilename: "[name]-chunk.js",
        },
        plugins: plugins,
        sassLoader: {
            //includePaths: paths.scss.all
        },
        module: {
            loaders: loaders
        },
        resolveLoader: {root: paths.node_modules},
        resolve: resolve,

        node : { fs: 'empty' }
    }
}
