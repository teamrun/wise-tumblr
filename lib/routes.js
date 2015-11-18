var router = require('koa-router')();

var graphql = require('graphql').graphql;
var schema = require('../graphql/index');

var controllers = [
  {
    path: '/graphql',
    method: 'post',
    handler: function*(){
      var query = this.request.body.query;
      var params = this.request.body.params;
      // console.log(query, params);

      var resp = yield graphql(schema, query, '', params);
      this.body = resp;
    }
  },
  {
    path: '/',
    handler: function*(){
      this.body = yield render('index');
    }
  },
  {
    path: '/api',
    handler: function*(){
      this.body = yield render('api');
    }
  },
];

controllers.forEach(function(rItem){
  var method = rItem.method || 'get';
  router[method](rItem.path, rItem.handler);
});

module.exports = router.routes();
