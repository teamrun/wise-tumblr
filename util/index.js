'use strict';

var fs = require('fs');
var path = require('path');

var debug = require('debug')('bench');

function promisify(asyncFn, ctx){
  return function(){
    var args = [].slice.call(arguments);
    var start = Date.now();
    return new Promise(function(resolve, reject){
      asyncFn.apply(ctx, args.concat(function(err, data){
        debug(`spent: ${Date.now() - start}ms`);
        err? reject(err) : resolve(data);
      }));
    });
  };
}

function wait(time){
  return new Promise(function(resolve, rejact){
    setTimeout(function(){
      resolve();
    }, time);
  });
}


// 一直do, 直到exitCond返回true
function* doUtil(fn, exitCond){
  var ret = [];
  var loopCount = 0;
  while(true){
    var result = yield fn(loopCount);
    console.log('done fn', loopCount + 1);
    ret.push(result);
    if(exitCond(result)){
      console.log('从循环执行中退出');
      break;
    }
    loopCount++;
  }
  return ret;
}

let encrypt = (str) => {
  let base64 = (new Buffer(str)).toString('base64');
  return base64.split('').reverse().join('');
}

let decrypt = (str) => {
  let base64 = str.split('').reverse().join('');
  return (new Buffer(base64, 'base64')).toString();
}

module.exports = {
  promisify,
  wait,
  doUtil,
  decrypt,
  encrypt
};
