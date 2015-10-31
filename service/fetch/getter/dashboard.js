var savePosts = require('../saver/post');

const PAGE_SIZE = 10;
const MAX_COUNT_ONE_SCHDUAL = 50;

function* fetchDashboard(client){
  var totalCount = 0;
  // 按页码 获取最新的post
  let fetchOnePage = (pageIndex) => {
    return client.dashboard({limit: PAGE_SIZE, offset: pageIndex*PAGE_SIZE})
  };

  let shouldExit = (fetchResult) => {
    if(fetchResult.posts){
      totalCount += fetchResult.posts.length;
      if(totalCount >= MAX_COUNT_ONE_SCHDUAL){
        return true;
      }
    }
    else{
      console.error('fetchOnePage error');
      return true;
    }
    return false;
  }

  var latestPostsRets = yield doUtil(fetchOnePage, shouldExit);

  var posts = latestPostsRets.reduce((prevRet, now) => {
    return prevRet.concat(now.posts);
  }, [])
  console.log(`将要保存 ${posts.length} 个post`);
  yield savePosts(posts);
}

module.exports = fetchDashboard;
