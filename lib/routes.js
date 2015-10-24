var router = require('koa-router')();

global.Service = require('../service');
var graphql = require('graphql').graphql;
// var schema = require('../graphql/index');

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
        path: '/explore',
        handler: function*(){
            var mediaFiles = yield Service.Media.expore();
            this.body = yield render('explore', {mediaFiles: mediaFiles});
        }
    },
    {
        path: '/media/:fileName',
        handler: function*(){
            this.body = Service.Media.serveFile(this.params.fileName);
        }
    }
];

controllers.forEach(function(rItem){
    var method = rItem.method || 'get';
    router[method](rItem.path, rItem.handler);
});

module.exports = router.routes();
