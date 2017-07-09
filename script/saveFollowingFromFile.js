'use strict';

const fs = require('fs');
const co = require('co');
const { Model, DBHelper } = require('../db/');

let filePath = '/Users/chenllos/Desktop/following.data.txt';

// console.log(Model);

fs.readFile(filePath, 'utf-8', (err, data) => {
  let lines = data.split('\n');
  let datas = lines.map((item) => {
    return JSON.parse(item);
  });
  let blogs = datas.reduce((prev, now) => {
    return prev.concat(now.blogs);
  }, []);

  console.log(blogs.length);
  co(DBHelper.batchSaveFollowing('teamrun',blogs))
    .then(() => console.log('batch save done'))
    .catch((err) => console.error(err.stack || err));
});
