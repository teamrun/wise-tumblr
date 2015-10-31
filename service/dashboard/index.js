function* getLatestOne(name){
  let followings = yield Service.Follow.getFollowingNames(name);
  return Model.Post.findOne({
    name: {$in: followings}
  }).sort({
    timestamp: -1
  });
}


module.exports = {
  getLatestOne
};
