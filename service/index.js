import _ from 'lodash';

import clients from './client';


export default {
  blogInfo: (blogName) => {
    return clients.random.blogInfo(blogName)
      .then((data) => {
        return data.blog
      });
  },
  avatar: (param) => {
    return clients.random.avatar(param.name, param.size)
      .then((data) => {
        return data.avatar_url;
      })
  }
}
