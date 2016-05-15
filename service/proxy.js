'use strict';

const fs = require('fs');
const crypto = require('crypto');
const url = require('url');
const path = require('path');

const mime = require('mime');
const request = require('request');

const log = require('../lib/logger');

let accessFile = promisify(fs.access);

let errHandler = (err) => {
  if(err){
    log.error(err);
  }
};


let md5 = (str) => {
  let md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

function makeLocalCachePath(_url){
  _url = decodeURIComponent(_url);
  let extName = path.extname(url.parse(_url).pathname);
  return config.localMediaCache + '/' + md5(_url) + extName;
}

module.exports = function* mediaProxy(){
  let _url = this.request.query.url;
  _url = decodeURIComponent(_url);
  let expectPath = makeLocalCachePath(_url);
  // 本地是否有缓存文件
  let fileExists;
  try{
    yield accessFile(expectPath);
    fileExists = true;
  }
  catch(err){
    fileExists = false;
  }
  // 从本地读取
  if(fileExists){
    this.set('x-serve-from', 'local');
    this.set('content-type', mime.lookup(expectPath));

    this.body = fs.createReadStream(expectPath);
  }
  // 从 remtoe 读取
  else{
    let webStream = request(_url, errHandler);
    // 写入到本地, 先不照顾单个路径下文件数的限制
    webStream.pipe(fs.createWriteStream(expectPath));
    this.set('x-serve-from', 'remote');
    this.body = webStream;
  }
}
