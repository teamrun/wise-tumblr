'use strict';

const _ = require('lodash');
const co = require('co');

const clients = require('./client');
const { Model, DBHelper } = require('../db/index.js');
const log = console.log.bind(console);

let foo = {foo: 'bar'};

// 远端操作, 调用 sdk, 取得数据后存如数据库
let Remote = {
  // 获取头像
  getAvatar(blogName){
    return clients.random.avatar(blogName, 128)
      .then((data) => {
        return data.avatar_url;
      });
  },
  // 查询 blog 信息
  queryBlogInfo(blogName){
    let blogInfoP = clients.random.blogInfo(blogName)
      .then((data) => data.blog);
    let avatarP = Remote.getAvatar(blogName)
    return Promise.all([blogInfoP, avatarP])
      .then((ret) => {
        let blogInfo = ret[0], avatar = ret[1];
        let doc = Model.Blog.build({
          name: blogInfo.name,
          title: blogInfo.title,
          description: blogInfo.description,
          avatar: avatar
        });
        return doc.insert().$promise;
      });
  },
  *following(user, skip, limit){
    const concurrencyLimit = 10;
    const avatarConcurrency = 2;
    let totalCount = 1, alreadyGet = 0, followings;
    let fUsers = [];
    do{
      let data = yield clients[user].following({
        limit: concurrencyLimit,
        offset: alreadyGet
      });
      totalCount = data.total_blogs;
      let blogs = data.blogs;
      // TODO: total_blogs是不精准的, 估计是有脏数据(某些 blog 移除了, 但是计数没有减少)
      // 是否需要提前退出: 请求拿到的数据是否在已经存储的数据里有了
      let withoutDirtyData = blogs.filter(b => {
        return fUsers.every(fu => fu.name !== b.name);
      });
      if(withoutDirtyData.length === 0){
        // console.log('remote.following exit early');
        break;
      }
      // console.log(withoutDirtyData.map(b => b.name));

      alreadyGet += withoutDirtyData.length;

      let withAvatarData = [];
      while(withoutDirtyData.length){
        let someAvatar = withoutDirtyData.splice(0, avatarConcurrency);
        let ret = yield someAvatar.map((b) => {
          return Remote.getAvatar(b.name)
            .then(picUrl => {
              return Object.assign({}, b, {avatar: picUrl});
            })
            .catch((err) => console.error(err.stack || err));
        });
        withAvatarData = withAvatarData.concat(ret);
      }

      fUsers = fUsers.concat(withAvatarData);
      yield DBHelper.batchSaveFollowing(user, withAvatarData);
    }
    while(alreadyGet < totalCount);
    return {
      total_blogs: fUsers.length,
      blogs: fUsers.slice(skip, limit)
    };
  }
};

module.exports = {
  blogInfo: (blogName) => {
    // if not in db, query sdk and save and return
    return Model.Blog.where({name: blogName}).findOne(true)
      .$promise.then(dbResult => {
        if(!dbResult){
          return Remote.queryBlogInfo(blogName);
        }
        return dbResult;
      });
  },
  // dashboard, 获取最新posts数据
  dashboard: (param) => {
    let { user, limit, offset, sinceId } = param;
    return co(DBHelper.queryDashboard(user, limit, offset));
  },
  likes: ({user, offset, limit, after, before}) => {
    return clients[user].likes({
      limit: limit,
      offset: offset,
      after: after,
      before: before
    }).then((data) => {
      return data;
    });
  },
  // like 和 unlike的操作, 成功时一个空数组的返回值
  // like 可以重复操作
  // unlike不可以 会遇到404错误
  like: ({user, postId, reblogKey}) => {
    return clients[user].like(postId, reblogKey);
  },
  unlike: ({user, postId, reblogKey}) => {
    return clients[user].unlike(postId, reblogKey);
  },
  following: ({user, skip, limit}) => {
    return co(function*(){
      let followRet = yield DBHelper.queryFollowing(user, skip, limit);
      if(!followRet || followRet.blogs.length === 0){
        return co(Remote.following(user, skip, limit));
      }
      return followRet;
    });
  }
};
