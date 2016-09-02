var paths = require('../../config/paths')

module.exports = {
    extensions: ['', '.js', '.json'],
    alias: {
        // This `alias` section can be safely removed after ejection.
        // We do this because `babel-runtime` may be inside `react-scripts`,
        // so when `babel-plugin-transform-runtime` imports it, it will not be
        // available to the app directly. This is a temporary solution that lets
        // us ship support for generators. However it is far from ideal, and
        // if we don't have a good solution, we should just make `babel-runtime`
        // a dependency in generated projects.
        // See https://github.com/facebookincubator/create-react-app/issues/255
        'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator')
    },
    modules: [paths.ownNodeModules, paths.appSrc]
}
