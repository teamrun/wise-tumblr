var debug = require('debug')('tclient');
var tumblr = require('tumblr.js');


function creator(clientConf){
    var client = tumblr.createClient(clientConf);

    // 用户主页
    client.dashboard = promisefy(client.dashboard, client);
    // 博主信息
    client._blogInfo = client.blogInfo;
    client.blogInfo = promisefy(client.blogInfo, client);
    client.blogInfo = function(name){
      return function(callback){
        client._blogInfo(name, callback)
      }
    };
    // 博主头像
    client.avatar = promisefy(client.avatar, client);
    // 获取当前登陆的用户 正在fo的所有人
    client.following = promisefy(client.following, client);
    // 当前用户 like的posts
    client.likes = promisefy(client.likes, client);

    return client;
}

module.exports = creator;
