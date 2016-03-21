const fs = require('fs');

const _ = require('lodash');

global.config = require('../config');
_.assign(global, require('../util'));

global.Service = require('../service');
global.render = require('./render');


module.exports = require('./mw');
