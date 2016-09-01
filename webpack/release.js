var setupRelease = require('./setup').setupRelease
var argv = require('yargs').argv;
var options = require("./options")
var path = require("path")

var colors = require('colors');

var webpack = require('webpack');

function doneWithRelease(version){
    if(version.noChanges){
        console.error("No changes".red)
    } else {
        console.info(("Built " + version.name + " " + version.id).green)
        console.info(("Production: " + version.production.toUpperCase()).red)
        console.info(("Release type: " + (argv['type'] ? argv['type'] : 'patch')).red)
    }
}

setupRelease(options, argv["production"]).then(function(newVersion){
    doneWithRelease(newVersion)
})
