const _ = require('lodash');

const clients = require('./client');
const log = console.log.bind(console);

let foo = {foo: 'bar'};


module.exports = {
  blogInfo: (blogName) => {
    return clients.random.blogInfo(blogName)
      .then((data) => {
        return data.blog;
      });
  },
  avatar: (param) => {
    return clients.random.avatar(param.name, param.size)
      .then((data) => {
        return data.avatar_url;
      });
  },
  // dashboard, 获取最新posts数据
  // 传sinceId, 传limit
  dashboard: (param) => {
    let { user, limit, offset, sinceId } = param;
    return clients[user].dashboard({
      limit: limit,
      since_id: sinceId,
      offset: offset
    }).then((data) => {
      // console.log(data.posts.map(function(item){
      //   return item.photos
      // }));
      return data.posts;
    });
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
    return clients[user].following({
      limit: limit,
      skip: skip
    }).then((data) => {
      // console.log(data);
      return data;
    });
  }
};
