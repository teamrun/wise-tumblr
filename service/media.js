var fs = require('fs');
var path = require('path');

var readDir = promisify(fs.readdir);
const PHOTO_DIR = config.savePath + '/photo';

var acceptableExts = 'jpg,jpeg,gif,png,mp4,webv'.split(',').map(function(item){
  return '.'+item;
})

var ID_REG = /[0-9]{10,14}/;
var MIDDLE_SIZE_REG = /\_500\./;
var ORIGINAL_SIZE_REG = /\_original\./;

function* explore(){
  var files = yield readDir(PHOTO_DIR);
  // 过滤出下载的图片, 特征是: 已某些后缀名结尾
  files = files.filter(function(f){
    return acceptableExts.indexOf(path.extname(f)) >= 0;
  });

  var exploreInfos = {};
  files.forEach(function(f){
    let extname = path.extname();
    let basename = f.replace(extname, '');
    let [postId, index, size] = basename.split('_');

    let fileUrl = `/photo/${postId}/${index}/${size}${extname}`;

    if(exploreInfos[postId]){
      exploreInfos[postId].push(fileUrl)
    }
    else{
      exploreInfos[postId] = [fileUrl];
    }
  });

  // 将文件数组改变成对象
  // for(var i in exploreInfos){
  //   var arr = exploreInfos[i];
  //   var obj = {count: arr.length};
  //   obj.msize = arr.filter(function(item){
  //     return MIDDLE_SIZE_REG.test(item);
  //   });
  //   obj.original = arr.filter(function(item){
  //     return ORIGINAL_SIZE_REG.test(item);
  //   });
  //
  //   exploreInfos[i] = arr;
  // }


  console.log(exploreInfos);
  return exploreInfos;
}

// 简单的拼接出图片地址
// TODO: detect file是否存在, 不存在的话用原post数据的图片
function servePhoto({postId, index, sizeName}){
  return fs.createReadStream(`${PHOTO_DIR}/${[postId, index, sizeName].join('_')}`);
}


module.exports = {
  explore,
  servePhoto
};
