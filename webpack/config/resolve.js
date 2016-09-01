var path = require('path');
var paths = require('../paths')

module.exports = {
    extensions: ['', '.js', '.scss', '.css'],
    //root: [],
    alias: {

        //_: require('lodash/fp'),
        //m: require('mithril'),
        //moment: require('moment'),
        //d3: require('d3'),
        //scss: paths.scss.global,
        fonts: paths.fonts,
        static: paths.static,
        img: paths.img,
        vendor: paths.vendor,
    },

    modules: paths.MODULE_DIRS
}
