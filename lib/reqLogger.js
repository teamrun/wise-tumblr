'use strict';

const util = require('util');
const url = require('url');
const path = require('path');

const chalk = require('chalk');

function padLeft(str, len){
  if(str.length < len){
    return ' '.repeat(len - str.length) + str;
  }
  else{
    return str;
  }
}
const METHOD_LEN = 6;
const SPEND_LEN = 5;
const SIZE_LEN = 6;
const ONE_KB = 1024;

let suitableVal = (val, unit, limit, biggerUint) => {
  if(val > limit){
    let fixedCount = (Math.log(limit)/Math.log(10)).toFixed(0) - 1 || 0;
    return (val/limit).toFixed(fixedCount) + biggerUint;
  }
  else{
    return val + unit;
  }
}

let echoStreamFileInfo = (startTime, size, link) => {
  let reqPath = url.parse(link).path;
  let imgName = path.basename(reqPath);

  let spend = Date.now() - startTime;
  spend = suitableVal(spend, 'ms', 1000, 's');

  size = Math.round(size/1024);
  size = suitableVal(size, 'k', 1000, 'm');
  console.log(chalk.gray(` fileproxy ${padLeft(spend, SPEND_LEN)} ${padLeft(size, SIZE_LEN)} ${imgName}` ));
};

module.exports = function(){
  // var colors = 'black,red,green,yellow,blue,magenta,cyan,white,gray'.split(',');
  // colors.forEach(function(c){
  //   console.log(chalk[c](c));
  // });
  return function* reqLogger(next){
    var start = Date.now();

    yield next;
    // this works for: fileproxy, stream body
    if(this.body.pipe instanceof Function && this.query.url){
      let total = 0;
      this.body.on('data', (d) => {
        total += d.length;
      });
      this.body.on('end', () => {
        echoStreamFileInfo(start, total, this.query.url);
      });
    }
    // 方法
    let method = this.method;
    // 路径
    let reqPath = this.path;
    // 耗时
    let spend = Date.now() - start;
    this.set('x-res-timing', spend);
    spend = suitableVal(spend, 'ms', 1000, 's');
    // 响应大小
    let size;
    if(this.response.length){
      // console.log(this.response.length);
      size = (this.response.length/ONE_KB).toFixed(1);
      size = suitableVal(size, 'k', 1000, 'm');
    }
    else{
      size = '';
    }

    // 最终合并
    let state = util.format('%s %s %s %s    %s',
      chalk.white(padLeft(method, METHOD_LEN)),
      chalk.green(this.status),
      chalk.white(padLeft(spend, SPEND_LEN)),
      chalk.gray(padLeft(size, SIZE_LEN)),
      chalk.gray(reqPath)
    );


    console.log(state);
  };
};
