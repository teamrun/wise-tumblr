import _ from 'lodash';

import clients from './client';

let foo = {foo: 'bar'};


export default {
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
  likes: ({user, skip, limit, after, before}) => {
    return clients[user].likes({
      limit: limit,
      skip: skip,
      after: after,
      before: before
    }).then((data) => {
      return data;
    });
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
