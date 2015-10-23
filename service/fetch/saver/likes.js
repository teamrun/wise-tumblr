// user info
// dashboard
// likes
// following

// like
// unlike
// follow
// unfollow
var _ = require('lodash');

var savePosts = require('./post');

function getLikeDocFromData(name, item){
    return {
        user_name: name,
        post_id: item.id,
        dt_like: new Date(item.liked_timestamp * 1000)
    };
}

// 将likes存储起来
// 根据 liked_timestamp  新的才有必要做存的操作
function* saveLikes(name, likes){
    yield Model.Likes.remove({dt_like: {$gt: 0}});
    console.log('all likes removed');

    var lastItem = yield Model.Likes.findOne().sort({ dt_like: -1 });
    var lastItemLikeTs
    if(lastItem){
        lastItemLikeTs = (new Date(lastItem.dt_like)).valueOf()/1000
    }
    else{
        lastItemLikeTs = 0;
    };
    // 过滤出需要保存的
    var needSave = likes.filter(function(item){
        return item.liked_timestamp > lastItemLikeTs;
    });
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
