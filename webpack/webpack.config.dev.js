var webpackConfig = require('./webpack.config')({
	__DEV__: true
});

var webpack = require('webpack');

module.exports = webpackConfig