var http = require('http');
var fs = require('fs');
var path = require('path')
var paths = require('../config/paths')
var env = require('../env/dev')

var finalhandler = require('finalhandler')
var serveStatic = require('serve-static')


var serve = serveStatic(paths.appBuild, {
	'index': ['index.html']
})

var server = http.createServer(function onRequest (req, res) {
	serve(req, res, finalhandler(req, res))
})

server.listen(8000)