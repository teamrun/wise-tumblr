/*
  定时任务函数: 爬取 dashboard 内容并保存
  * 根据参数获取过滤函数: 是一直抓到满足一定的个数, 还是一直抓到数据库里之前最新的
*/

const co = require('co');

// for setup
require('../lib/index.js');
const clients = require('../service/client.js');
const { Model, DBHelper } = require('../db/index.js');

function* saveDashboard(user, limitAmount){
  limitAmount = limitAmount || Infinity;
  let client = clients[user];

  let previousLatestPost = yield DBHelper.queryDashboard(user, 1, 0);
  // 抓取, 保存, 是否退出
  let savedIds = [], filterFn;
  if(previousLatestPost.length === 0){
    // 之前没有存过, 只能按个数来显示
    if(limitAmount === Infinity){
      throw new Error('have not save before, and limitAmount is Infinity');
    }
    // 过滤条件: 多余既定个数 or 已经存储过( sdk 接口没有去重)
    filterFn = (posts) => {
      return posts.filter((item) => {
        if(savedIds.length >= limitAmount) return false;
        if(savedIds.indexOf(item.id) >=0 ) return false;
        savedIds.push(item.id);
        return true;
      });
    }
  }
  else{
    let lastOne = previousLatestPost[0];
    let lastOneInRespIndex = Infinity;
    // 之前存储过, 综合考虑个数和已存储
    // 过滤条件:  + 已经在数据库中存储了
    filterFn = (posts) => {
      return posts.filter((item, index) => {
        let itemId = item.id;
        if(savedIds.length >= limitAmount) return false;
        if(savedIds.indexOf(itemId) >=0 ) return false;
        if(index > lastOneInRespIndex) return false;
        if(itemId <= lastOne.id){
          lastOneInRespIndex = index;
          return false;
        }
        savedIds.push(itemId);
        return true;
      });
    }
  }

  let pageNo = 0;
  let saveRet;
  while(saveRet !== false){
    saveRet = yield fetchFilterAndSave(client, pageNo, filterFn);
    pageNo++;
  }
  console.log('fetchFilterAndSave all done!! savedCount:', savedIds.length);
}

function* fetchFilterAndSave(client, pageNo, filterFn){
  let pageSize = 20;
  let resp = yield client.dashboard({
    limit: pageSize,
    offset: pageNo*pageSize
  });
  let needSave = filterFn(resp.posts);
  console.log('got posts amount:', resp.posts.length, '\n\twill save amount:', needSave.length);
  if(needSave.length){
    yield DBHelper.batchSavePost(needSave);
    return true;
  }
  else{
    return false;
  }
}

co(saveDashboard('libertyartchen', 200))
.then(() => console.log('saveDashboard done!'))
.catch((err) => {
  console.log('got error');
  console.error(err.stack || err);
});
module.exports = saveDashboard;
