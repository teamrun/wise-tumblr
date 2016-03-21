const router = require('koa-router')();

const graphql = require('graphql').graphql;
const schema = require('../graphql/index');

const mediaProxy = require('../service/proxy');

var controllers = [
  {
    path: '/graphql',
    method: 'post',
    handler: function*(){
      var query = this.request.body.fields.query;
      var params = this.request.body.fields.params;

      var resp = yield graphql(schema, query, '', params);
      if(resp.errors){
        resp.errors.forEach((item) => {
          console.log(typeof item);
          console.log(item.stack);
        });
      }
      this.set('Access-Control-Allow-Origin', '*');

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
