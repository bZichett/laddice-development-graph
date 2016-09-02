

module.exports = function (options) {
    return {
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
        historyApiFallback: true,
        hot: true, // Note: only CSS is currently hot reloaded
        publicPath: options.publicPath,
        quiet: true,
        noInfo: false,
        filename: "bundle.js",
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000
        },
        proxy: {
            //'/static/*': {
            //    target: 'http://localhost:8000',
            //    secure: false
            //}
        },
    }
}