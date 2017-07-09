'use strict';

const url = require('url');
const request = require('request');

let tumblr;
if(process.env.NODE_ENV === 'production'){
  tumblr = require('tumblr.js');
}
else{
  tumblr = require('../lib/tumblr');
  tumblr.request({
    get: (opt, callback) => {
      let _opt = Object.assign({}, opt);
      let urlInfo = url.parse(opt.url);
      _opt.url = 'http://proxy.chenllos.com/api';
      _opt.headers['x-proxy-dest'] = encrypt(opt.url);
      _opt.headers['x-passed-oauth'] = JSON.stringify(_opt.oauth);

      return request.get(_opt, (err, resp, body) => {
        callback(err, resp, body);
      });
    },
    post: (opt, callback) => {

    }
  });
}


function creator(clientConf){
  var client = tumblr.createClient(clientConf);

  // 用户主页
  client.dashboard = promisify(client.dashboard, client);
  // 博主信息
  client._blogInfo = client.blogInfo;
  client.blogInfo = promisify(client.blogInfo, client);
  // 博主头像
  client.avatar = promisify(client.avatar, client);
  // 获取当前登陆的用户 正在fo的所有人
  client.following = promisify(client.following, client);
  // 当前用户 like的posts
  client.likes = promisify(client.likes, client);
  // like动作
  client._like = client.like;
  client.like = promisify(client.like, client);
  client.unlike = promisify(client.unlike, client);

  return client;
}

module.exports = creator;
