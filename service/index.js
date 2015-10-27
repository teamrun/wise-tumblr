var _ = require('lodash');
var requireDir = require('require-dir');

var clientCreator = require('../util/clientCreator');

global.tumblrClient = clientCreator(Array.isArray(config.tumblr)? config.tumblr[0] : config.tumblr);


var files = requireDir('./', {recurse: true});

var services = {};
for(var i in files){
  var sName = _.capitalize(i);
  services[sName] = files[i].index? files[i].index : files[i];
}

module.exports = services;
