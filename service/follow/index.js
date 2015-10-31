const FollowModel = Model.Follow;
const UserModel = Model.User;

let getFollowingNames = (name) => {
  return FollowModel.find({name: name})
    .then((docs) =>
      docs.map((d) => d.blog_name)
    );
}

let getFollowingUsers = (name) => {
  getFollowingNames(name)
    .then((fNames) => {
      return UserModel.find({
        name: {$in: fNames}
      });
    });
}

let saveFollowing = (name, blog_name) => {
  var doc = {name, blog_name};
  return FollowModel.update(doc, {
    $set: doc,
    $setOnInsert: {dt_create: new Date()}
  }, {upsert: true});
};


module.exports = {
  getFollowingNames,
  getFollowingUsers,
  saveFollowing
}
