var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path')
var paths = require('../paths')

function q(loader, query) {
    return loader + "?" + JSON.stringify(query);
}

var cssLoaderQuery = {
    includePaths: paths.scss.all,
    indentedSyntax: __BUILD__ ? false : true,
    sourceMap: __BUILD__ ? false : true,
};

var extractScss = ExtractTextPlugin.extract({fallbackLoader: 'style-loader',
    loader: 'css-loader' + q('!sass-loader', cssLoaderQuery),
    publicPath: __BUILD__ ? '../../' : '../..'
});

var l = [

/**  SCSS */
    {
        test: /\.scss$/,
        loaders: extractScss,
        name: 'sass-loader' // used only to easily filter this loader out for unit testing
    },

/**  ES6 */
    {
        test: /\.js$/,
        exclude: /\/node_modules/,
        loader: 'babel-loader',
        query: {
            cacheDirectory: true,
            // TODO Babel caching optimization plugin: Fails right now...
            babelrc: path.resolve(paths.src, '.babelrc')
        }
    },
    {
        test: /\.json$/,
        loader: 'json-loader'
    },

    {
        test: /\.(jpe?g|png|gif|svg)$/,
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
        ]
    },
];

module.exports = l;