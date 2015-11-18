var router = require('koa-router')();

var graphql = require('graphql').graphql;
var schema = require('../graphql/index');

let mediaProxy = require('../service/proxy');

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
  {
    path: '/fileproxy',
    handler: function*(){
      this.body = mediaProxy(this.request.query.url, this.req);
    }
  }
];

controllers.forEach(function(rItem){
  var method = rItem.method || 'get';
  router[method](rItem.path, rItem.handler);
});

module.exports = router.routes();
