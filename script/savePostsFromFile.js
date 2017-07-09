'use strict';

const fs = require('fs');
const co = require('co');
const { Model, DBHelper } = require('../db/');

let filePath = '/Users/chenllos/Desktop/dashboard.data.txt';

// console.log(Model);

fs.readFile(filePath, 'utf-8', (err, data) => {
  let lines = data.split('\n');
  let datas = lines.map((item) => {
    return JSON.parse(item);
  });
  let posts = datas.reduce((prev, now) => {
    return prev.concat(now.posts);
  }, []);

  console.log(posts.length);
  co(DBHelper.batchSavePost(posts))
    .then(() => console.log('batch save done'))
    .catch((err) => console.error(err.stack || err));
});
