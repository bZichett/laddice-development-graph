/** Directory and files */
var path = require('path')
var fs = require('fs')

/** Webpack */
var webpack = require('webpack')
var WebpackDevServer = require("webpack-dev-server")
var options = require("./options")
var webpackConfigFunc = require("./webpack.config.js")

var webpackConfig = webpackConfigFunc({devServer: true})

webpackConfig.debug = false

webpackConfig.devtool = "eval"

var wpDevConfig = {
    contentBase: path.resolve(webpackConfig.output.path),
    //publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: false,
        warnings: false,
        publicPath: false

    },
    proxy: {
        '/api/v1/*': {
            target: 'http://localhost:8000',
            secure: false
        },
        '/media/*': {
            target: 'http://localhost:8000',
            secure: false
        },
        '/static/*': {
            target: 'http://localhost:8000',
            secure: false
        }
    },
    quiet: false,
    noInfo: false,
    filename: "bundle.js",
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }

}

new WebpackDevServer(webpack(webpackConfig), wpDevConfig)
    .listen(8080, "localhost", function (err) {
        if (err) throw new console.error("webpack-dev-server", err);
        console.log("[webpack-dev-server]", "http://localhost:8000/webpack-dev-server/index.html");
        console.log('Listening at 0.0.0.0:8080')
    });
