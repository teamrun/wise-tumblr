var saveLikes = require('../saver/likes');

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

var PAGE_SIZE = 10;
module.exports = function* (client){

    // yield Model.Likes.remove();
    // console.log('all likes removed');


    // 获取
    var latestLiked = yield Service.Likes.getLatest(client.name);
    console.log('上次保存的最近的一个likes:', latestLiked);
    var alreadySavedLikedTime = latestLiked? latestLiked.liked_timestamp : 0;

    // 每一次取一页, 直到某一页:
    //      为空
    //  或  其中的post的时间有小于已经存储了的
    var likesResults = yield doUtil(function(i){
        return client.likes({
            limit: PAGE_SIZE,
            offset: i*PAGE_SIZE
        });
    }, function(result){
        // return true;
        // 判断是否为空 空的话就是没有更新的likes了
        if(result.liked_posts){
            var likedPosts = result.liked_posts;
            console.log(likedPosts.map(function(item){
                return item.id;
            }).join(','));
            if(likedPosts.length === 0){
                return true;
            }
            else{
                return likedPosts.filter(function(item){
                    return item.liked_timestamp < alreadySavedLikedTime;
                }).length > 0;
            }
        }
        else{
            console.log('stop fetch likes: fetch failed, no result.liked_posts');
            return true;
        }
    });

    var likes = likesResults.reduce(function(prevRet, now){
        return prevRet.concat(now.liked_posts);
    }, [])
    .filter(function(item){
        return item.liked_timestamp > alreadySavedLikedTime;
    });

    console.log('有多少个likes需要保存', likes.length);

    // 保存
    yield saveLikes(client.name, likes);
}
