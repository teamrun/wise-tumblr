'use strict';

var app = require('koa')();

var setup = require('./lib');

setup(app);

app.listen(config.port, function(){
  console.log('app is listening at %s', config.port);
});
