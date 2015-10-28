// 批量保存posts
// 缓存图片
var fs = require('fs');
var path = require('path');

var _ = require('lodash');

// 将一批posts保存起来
// 5个并发
function* savePosts(posts){
  var totalCount = posts.length;

  while(posts.length > 0){
    var somePost = posts.splice(0, 5);
    yield somePost.map(function(item){
      return Service.Post.saveIfNotExist(item);
    });
    console.log(`---------- done with ${somePost.length} posts`);
  }
  console.log(`********* save ${totalCount} posts done! *********`);
}

module.exports = savePosts;
