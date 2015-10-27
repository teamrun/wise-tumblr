var fs = require('fs');
var path = require('path');

var readDir = promisefy(fs.readdir)

var acceptableExts = 'jpg,jpeg,gif,png,mp4,webv'.split(',').map(function(item){
  return '.'+item;
})

var ID_REG = /[0-9]{10,14}/;
var MIDDLE_SIZE_REG = /\_500\./;
var ORIGINAL_SIZE_REG = /\_original\./;

function* explore(){
  var files = yield readDir(config.savePath);
  // 过滤出下载的图片, 特征是: 已某些后缀名结尾
  files = files.filter(function(f){
    return acceptableExts.indexOf(path.extname(f)) >= 0;
  });

  var exploreInfos = {};
  files.forEach(function(f){
    console.log(f);
    var id = f.match(ID_REG)[0];

    var fileUrl = '/media/'+f;
    if(exploreInfos[id]){
      exploreInfos[id].push(fileUrl)
    }
    else{
      exploreInfos[id] = [fileUrl];
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

function serveFile(fPath){
  return fs.createReadStream(`${config.savePath}/${fPath}`);
}


module.exports = {
  expore: explore,
  serveFile: serveFile
};
