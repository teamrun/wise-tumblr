'use strict';

const bodyParser = require('koa-better-body');
const errHandler = require('./errorHandler');
const reqLogger = require('./reqLogger');
const routes = require('./routes');
const kaoStatic = require('koa-static');

module.exports = function(app){
  app.use(reqLogger());
  app.use(errHandler);

  app.use(kaoStatic(config.appPath + '/public'));
  app.use(bodyParser({
    multipart: true
  }));
  app.use(routes);
};
