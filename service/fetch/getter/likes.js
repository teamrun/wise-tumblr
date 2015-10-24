var saveLikes = require('../saver/likes');

module.exports = function* (client){
    // 获取
    // 一直到没有最新的
    console.log('fetching likes...');
    var resp = yield client.likes({ limit: 100 });
    // var resp = yield client.likes({ limit: 20 });
    if(!resp || !resp.liked_posts){
        throw 'fetch likes error';
    }
    console.log(`got ${resp.liked_posts.length} likes`);

    // 保存
    yield saveLikes(client.name, resp.liked_posts);
}
