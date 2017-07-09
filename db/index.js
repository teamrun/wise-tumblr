'use strict';

let con = require('./connection');
let Model = require('./model')(con);


const BATCH_AMOUNT = 10;

let DBHelper = {
  savePost(obj) {
    let doc = Model.Post.build(obj);
    return doc.insert().$promise;
  },
  *batchSavePost(postArr) {
    let cloneArr = Object.assign([], postArr);
    let resultArr = [];
    while(cloneArr.length){
      let some = cloneArr.splice(0, BATCH_AMOUNT);
      let ret = yield some.map(this.savePost);
      console.log('batch save done!');
      resultArr = resultArr.concat(ret);
    }
    return resultArr;
  },
  // TODO: blog, FollowRelation记录的唯一性
  saveBlog(blogData){
    return Model.Blog.where({name: blogData.name})
      .findOne(true).$promise
      .then(doc => {
        if(!doc){
          let blogDoc = Model.Blog.build(blogData);
          return blogDoc.save().$promise;
        }
        return doc;
      });
  },
  saveFollowingRelation(user, target, updated){
    return Model.FollowRelation.where({
      master: user,
      target
    }).findOne(true).$promise
      .then(doc => {
        if(!doc){
          let doc = Model.FollowRelation.build({
            master: user,
            target,
            updated
          });
          return doc.save().$promise;
        }
        return doc;
      });
  },
  saveFollowing(user, fBlog) {
    // save blog info
    let blogP = this.saveBlog(fBlog);
    // save following relation
    let frP = this.saveFollowingRelation(user, fBlog.name, fBlog.updated);
    return Promise.all([blogP, frP]);
  },
  *batchSaveFollowing(user, fBlogs){
    let cloneArr = Object.assign([], fBlogs);
    let resultArr = [];
    while(cloneArr.length){
      let some = cloneArr.splice(0, BATCH_AMOUNT);
      let ret = yield some.map((fblog) => {
        return this.saveFollowing(user, fblog);
      });
      console.log('one batch done');
      resultArr = resultArr.concat(ret);
    }
    return resultArr;
  },
  getFollowingCount(user){
    return Model.FollowRelation.where({master: user})
      .count().$promise;
  },
  // TODO: 考虑一个用户有过多的 following 的情况
  queryFollowRelation(user, skip = 0, limit = 20){
    return  Model.FollowRelation
      .where({master: user})
      .limit({skip, limit})
      .orderBy('updated desc')
      .find(true)
      .$promise.then((rows) => rows.map(r => r.target));
  },
  *queryFollowing(user, skip = 0, limit = 20){
    // 取个数
    let count = this.getFollowingCount(user);
    // 取name, 查用户
    let fNames = yield this.queryFollowRelation(user, skip, limit);
    let fUsers = yield fNames.map(n => {
      return Model.Blog.where({name: n}).findOne(true).$promise;
    });
    return {
      total_blogs: count,
      blogs: fUsers
    };
  },
  *queryDashboard(user, limit = 20, skip = 0){
    let fNames = yield this.queryFollowRelation(user);
    if(fNames.length === 0){
      throw new Error('have no FollowRelation in db');
    }
    // console.log(followings);
    var p = Model.Post.where({
      blog_name: {$in: fNames}
    }).limit({skip, limit})
    .orderBy('timestamp desc')
    .find(true).$promise;

    return p;
  }
};

module.exports = {
  Model,
  DBHelper
};
