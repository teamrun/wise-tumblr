var path = require('path');

var _ = require('lodash');
var co = require('co');

// 保存媒体文件的路径
var WRITE_FILE_PATH = config.savePath + '/photo';

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
    // post.photos 是一个对象数组, 一篇post可能发布多张图片
    // 对象中有 500, original, caption
    post.photos.forEach(function(item, i){
      var pArr = [];

      if(item['500'] && item['500'].url){
        fileUrls[item['500'].url] = `${postId}_${i}_500.${fileTypes[i]}`;
      }
      if(item.original && item.original.url){
        fileUrls[item.original.url] = `${postId}_${i}_original.${fileTypes[i]}`;
      }
    });
    return yield saveNetfiles(fileUrls, WRITE_FILE_PATH);
  }
  else{
    //  "video_url": "https://vt.tumblr.com/tumblr_nvb0075Tm61ufwk6d.mp4",
    // "html5_capable": true,
    // "thumbnail_url": "https://31.media.tumblr.com/tumblr_nvb0075Tm61ufwk6d_frame1.jpg",
    // "thumbnail_width": 720,
    // "thumbnail_height": 404,
    // "duration": 58,


    // "video_url": "https://vt.tumblr.com/tumblr_nw2fw18hh11r0flj3_720.mp4",
    //    "html5_capable": true,
    //    "thumbnail_url": "https://31.media.tumblr.com/tumblr_nw2fw18hh11r0flj3_frame1.jpg",
    //    "thumbnail_width": 1920,
    //    "thumbnail_height": 1080,
    //    "duration": 60,


    // "video_url": "https://vt.tumblr.com/tumblr_nu79k3HPrY1utfe3x.mp4",
    // "html5_capable": true,
    // "thumbnail_url": "https://31.media.tumblr.com/tumblr_nu79k3HPrY1utfe3x_frame1.jpg",
    // "thumbnail_width": 640,
    // "thumbnail_height": 358,
    // "duration": 61,
    return `count node download because type is ${post.type}`;
  }
}
// 保存单个
function* savePost(p){
  var doc = buildPostDoc(p);

  var query = {
    id: p.id
  };
  var coverImgUrl;
  if( p.trail && p.trail[0] && p.trail[0].blog && p.trail[0].blog.theme && p.trail[0].blog.theme.header_image){
    coverImgUrl = p.trail[0].blog.theme.header_image;
  }
  // console.log('cover image url: ', coverImgUrl);
  let ret = yield {
    file: downloadPostFiles(doc),
    db: Model.Post.update(query, doc, {upsert: true}),
    postUser: Service.User.saveIfNotExist(p.blog_name, coverImgUrl)
  };
  console.log(ret.file);
}

var saveIfNotExist = (p) => {
  return Model.Post.findOne({id: p.id})
    .then((doc) => {
      // 如果存在 直接返回
      if(doc){
        return true;
      }
      // 否则 执行保存
      else{
        return co(savePost(p));
      }
    });
}

module.exports = {
  savePost,
  saveIfNotExist
}
