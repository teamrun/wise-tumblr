const PAGE_SIZE = 20;

function* fetchFollowing(client){
  let totalCount = 0;
  // 获取一页
  let getOnePage = (pageIndex) => {
    return client.following({
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE
    });
  }

  let shouldExit = (pageResp) => {
    if(pageResp.blogs){
      // console.log(pageResp);
      totalCount += pageResp.blogs.length;

      if(totalCount >= pageResp.total_blogs){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return true;
    }
    return false;
  };

  let followingRets = yield doUtil(getOnePage, shouldExit);

  let followingBlogs = followingRets.reduce((prevRet, now) => {
    return prevRet.concat(now.blogs);
  }, []);

  console.time(`save ${followingBlogs.length} following`);
  yield followingBlogs.map((item) => {
    return Service.Follow.saveFollowing(client.name, item.name);
  });
  console.timeEnd(`save ${followingBlogs.length} following`);
}


module.exports = fetchFollowing;
