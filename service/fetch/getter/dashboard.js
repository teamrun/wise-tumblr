var savePosts = require('../saver/post');

const PAGE_SIZE = 5;

function* fetchDashboard(client){
  var totalCount = 0;
  // 按页码 获取最新的post
  let fetchOnePage = (pageIndex) => {
    return client.dashboard({limit: PAGE_SIZE, skip: pageIndex*PAGE_SIZE})
  };

  let shouldExit = (fetchResult) => {
    // 先直接退出
    return true;
  }

  var latestPostsRets = yield doUtil(fetchOnePage, shouldExit);

  var posts = latestPostsRets.reduce((prevRet, now) => {
    return prevRet.concat(now.posts);
  }, [])
  console.log(`将要保存 ${posts.length} 个post`);
  yield savePosts(posts);
}

module.exports = fetchDashboard;
