let LikesModel = Model.Likes;
let PostModel = Model.Post;

let getLatest = (name) => {
  return LikesModel.findOne().sort({ liked_timestamp: -1 });
};

const defaultOpt = {skip: 0, limit: 20};
let getUserLikes = (name, opt) => {
  opt = _.assign({}, defaultOpt, opt);

  return LikesModel.find({
      user_name: name
    })
    .sort({ liked_timestamp: -1 })
    .limit(opt.limit)
    .skip(opt.skip);
};

let getUserLikePosts = (name, opt) => {
  return getUserLikes(name, opt)
    .then((data) => {
      let likePostIds = data.map((d) => {
        return d.post_id;
      });
      return PostModel.find({
        id: {$in: likePostIds}
      });
    });
}; 

module.exports = {
  getLatest,
  getUserLikes,
  getUserLikePosts
}
