var fs = require('fs');

var _ = require('lodash');

global.config = require('../config');
_.assign(global, require('../util'));

global.render = require('./render');


module.exports = require('./mw');
