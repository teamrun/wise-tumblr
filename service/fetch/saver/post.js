// 批量保存posts
// 缓存图片
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var request = require('request');

var WRITE_FILE_PATH = config.savePath;

var ERROR_DATA = {};

// 将错误记录下来
function logErr(type, url, filePath){
  if(ERROR_DATA[type]){
    ERROR_DATA[type].push({
      url: url,
      name: path.basename(filePath)
    });
  }
  else{
    ERROR_DATA[type] = [{
      url: url,
      name: path.basename(filePath)
    }];
  }
}

// 从获取的网络response中构建doc
function buildPostDoc(item){
  // 是否是图片类型的post
  if(item.type === 'photo'){
    // 精简图片信息, 只保留原图和500宽的图
    var photos = item.photos;
    delete item.photos;
    item.photos = photos.map(function(item){
      return {
        caption: item.caption,
        500: _.find(item.alt_sizes, function(p){
          return p.width === 500;
          // return p.width === 100;
        }),
        original: item.original_size
      }
    });

    // 构建一个数组 里面存储图片类型
    var typesArr = photos.map(function(item){
      return path.extname(item.original_size.url).replace('.', '');
    });
    item.fileTypes = typesArr;
  }

  return item;
}

// 将网络文件写到本地
function saveNetfiles(urlNamePairs, filePath){
  var promiseArr = [];
  for(var url in urlNamePairs){
    var name = urlNamePairs[url];
    promiseArr.push( gotFile(url, path.join(filePath, name )) );
  }
  return promiseArr;
}

// 保存所有的媒体文件 图片视频
function* downloadPostFiles(post){
  if(post.type === 'photo'){
    var postId = post.id;
    var fileTypes = post.fileTypes;

    var count = 0;

    var fileUrls = {};
    post.photos.forEach(function(item, i){
      var pArr = [];

      if(item['500'] && item['500'].url){
        count++;
        fileUrls[item['500'].url] = `${postId}_${i}_500.${fileTypes[i]}`;

      }
      if(item.original && item.original.url){
        count++;
        fileUrls[item.original.url] = `${postId}_${i}_original.${fileTypes[i]}`;
      }
    });
    console.log(`run ${count} threads to download file`);
    yield saveNetfiles(fileUrls, WRITE_FILE_PATH);
  }
  else{
    console.log('could not download because type is', post.type);
  }
}
// 保存单个
function* saveOne(p){
  var doc = buildPostDoc(p);

  var query = {
    id: p.id
  };
  yield {
    file: downloadPostFiles(doc),
    db: Model.Post.update(query, doc, {upsert: true}),
    postUser: Service.User.getUser(p.blog_name)
  };
  console.log(`save post ${p.id}'s files & doc done`);
}

// 将一批posts保存起来
// 5个并发
function* savePosts(posts){
  var totalCount = posts.length;

  while(posts.length > 0){
    var somePost = posts.splice(0, 5);
    yield somePost.map(function(item){
      return saveOne(item);
    });
    console.log(`---------- done with ${somePost.length} posts`);
  }
  console.log(`save ${totalCount} posts done! `);

  fs.writeFile(`${config.appPath}/test/save_post_err.json`, JSON.stringify(ERROR_DATA, null, 4), function(){
    console.log('error saved');
  });
}

module.exports = savePosts;
