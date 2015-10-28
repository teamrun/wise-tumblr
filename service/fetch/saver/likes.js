var _ = require('lodash');

var savePosts = require('./post');

function getLikeDocFromData(name, item){
  return {
    user_name: name,
    post_id: item.id,
    liked_timestamp: item.liked_timestamp
  };
}

// 将likes存储起来
function* saveLikes(name, likes){
  var needSave = likes;

  if(needSave.length === 0){
    console.log('0 new likes, exit saveLikes');
    return;
  }

  var docs = needSave.map(function(item){
    return new Model.Likes( getLikeDocFromData(name, item) );
  });

  // 将likes数据直接一口气全部保存
  console.time(`save ${docs.length} likes docs`);
  yield docs.map(function(d){
    return d.save()
  });

  // 保存相应的post数据
  yield savePosts(needSave);
  console.timeEnd(`save ${docs.length} likes docs`);
}

module.exports = saveLikes;
