'use strict';

const request = require('request');

let errHandler = (err) => {
  if(err){
    console.log(err);
  }
};

module.exports = (url, req) => {
  url = decodeURIComponent(url);
  return req.pipe(request(url, errHandler))
};
