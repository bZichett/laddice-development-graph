var path = require('path');

/** DIRECTORIES */
var ROOT = path.resolve(__dirname, '..')
var STATIC = path.resolve(ROOT, 'static')
var BUILD = path.resolve(ROOT, 'build')

var SRC_DIR = path.resolve(ROOT, 'src')
var IMG = path.resolve(ROOT, 'img')

/** TESTS */
var UNIT_TEST_DIR = path.resolve(ROOT, 'test/unit')

/** ES6 */
var node_modules_dir = path.resolve(ROOT, 'node_modules')

/** ASSETS */
var vendor_dir = path.resolve(ROOT, 'vendor')
var fonts_dir = path.resolve(STATIC, 'fonts')


module.exports = {

    root: ROOT,
    webpack: path.resolve(ROOT, 'webpack'),
    build: {
        root: BUILD,
        versions: path.resolve(BUILD, 'versions'),
        development: path.resolve(BUILD, 'development'),
        dirNames: {
            js: 'js',
            css: 'css'
        },
        filesConfig: 'localhost:8000/img/[name]-[sha512:hash:base64:7].[ext]',
        filesConfigDev: '/[path][name].[ext]'
    },

    src: SRC_DIR,
    img: IMG,
    fonts: fonts_dir,
    vendor: vendor_dir,
    static: STATIC,
    test: {
        unit: UNIT_TEST_DIR
    },

    node_modules: node_modules_dir,

    MODULE_DIRS: [fonts_dir]
};
