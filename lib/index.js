var _ = require('lodash');
global.config = require('../config');

_.assign(global, require('../util'));

global.render = require('./render');
global.Model = require('../db');
global.Service = require('../service');


module.exports = require('./mw');
