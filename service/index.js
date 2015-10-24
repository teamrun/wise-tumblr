var _ = require('lodash');
var requireDir = require('require-dir');

var files = requireDir('./');

var services = {};
for(var i in files){
    var sName = _.capitalize(i);
    services[sName] = files[i];
}

module.exports = services;
