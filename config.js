'use strict';

const _ = require('lodash');
let conf ={
  appPath: __dirname,
  port: 9016,
  localMediaCache: '/Users/chenllos/Pictures/snip_shots/.local_cache'
};

let localConf;
try{
  localConf = require('./local_config');
}
catch(e){}

conf = _.assign({}, conf, localConf);

module.exports = conf;
