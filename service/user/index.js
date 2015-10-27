var path = require('path');

var Got = require('got');
var UserModel = Model.User;

var avatarPath = config.savePath + '/avatar';

function saveAvatar(userName){
  return tumblrClient.avatar(userName, 128).then(function(data){
    var avatarUrl = data.avatar_url;
    var extName = path.extname(avatarUrl);
    return gotFile(avatarUrl, `${avatarPath}/${userName}_128${extName}`);
  });
}

// 保存用户
function* saveUser(userInfo){
  var query = {name: userInfo.name}
  yield {
    db: UserModel.update(query, userInfo, {upsert: true}),
    avatar: saveAvatar(userInfo.name)
  }
}

function* getUser(name){
  var user = yield UserModel.findOne({name: name});
  if(!user){
    let resp = yield tumblrClient.blogInfo(name);
    user = resp.blog;
    yield saveUser(user);
  }
  return user;
}

module.exports = {
  getUser,
  saveUser
}
