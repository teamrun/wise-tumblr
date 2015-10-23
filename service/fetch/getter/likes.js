var saveLikes = require('../saver/likes');

module.exports = function* (client){
    // 获取
    // 一直到没有最新的
    console.log('fetching likes...');
    var resp = yield client.likes();
    if(!resp || !resp.liked_posts){
        throw 'fetch likes error';
    }

    // 保存
    yield saveLikes(client.name, resp.liked_posts);
}
