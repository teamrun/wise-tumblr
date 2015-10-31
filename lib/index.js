var fs = require('fs');

var _ = require('lodash');

global.config = require('../config');
_.assign(global, require('../util'));

global.render = require('./render');
global.Model = require('../db');
global.Service = require('../service');

// 初始化存储目录
var mkdir = promisify(require('fs-extra').mkdirp);
var folders = 'photo,avatar,cover,video'.split(',');
folders.forEach(function(f){
  mkdir(config.savePath + '/' + f);
});

module.exports = require('./mw');
