var bodyParser = require('koa-bodyparser');
var errHandler = require('./errorHandler');
var reqLogger = require('./reqLogger');
var routes = require('./routes');
var kaoStatic = require('koa-static');

module.exports = function(app){
    app.use(reqLogger());
    app.use(errHandler);

    app.use(kaoStatic(config.appPath + '/public'));
    app.use(bodyParser());
    app.use(routes);
}
