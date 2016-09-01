var paths = require('../paths')
var path = require('path');

var webEntry = path.resolve(paths.src, 'app.js')

var HOT = 'webpack-dev-server/client?http://localhost:8080'
var DEV_SERVER_HOT = 'webpack/hot/only-dev-server'
var HOT_CLIENT = 'webpack-hot-middleware/client'

module.exports = {
    //HOT,
    //DEV_SERVER_HOT,
    vendor: ['mithril'],
    web: ['babel-polyfill', webEntry]
}