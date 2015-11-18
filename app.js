var app = require('koa')();
require('babel/register');

var setup = require('./lib');

setup(app);

app.listen(config.port, function(){
  console.log('app is listening at %s', config.port);
});
