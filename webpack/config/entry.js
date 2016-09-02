var paths = require('../../config/paths');
var path = require('path');

module.exports = [
	require.resolve(paths.config + '/polyfills'),
	path.join(paths.appSrc, 'app')
].concat(__PROD__ ? [

] : [])
.concat(__DEV__ ? [
	require.resolve('webpack-dev-server/client') + '?/',
	require.resolve('webpack/hot/dev-server'),
] : [])