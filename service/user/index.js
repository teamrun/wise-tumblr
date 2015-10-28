var path = require('path');

var Got = require('got');
var UserModel = Model.User;

var AVATAR_PATH = config.savePath + '/avatar';
var COVER_PATH = config.savePath + '/cover';

// 保存图片
function saveAvatar(userName){
  return tumblrClient.avatar(userName, 128).then(function(data){
    var avatarUrl = data.avatar_url;
    var extName = path.extname(avatarUrl);
    return gotFile(avatarUrl, `${AVATAR_PATH}/${userName}_128${extName}`);
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


// 先查询数据库, 数据库中没有再去获取用户信息然后保存
function* getUser(name){
  var user = yield UserModel.findOne({name: name});
  if(!user){
    let resp = yield tumblrClient.blogInfo(name);
    user = resp.blog;
    yield saveUser(user);
  }
  return user;
}

// 如果用户不存在 就去保存
var saveIfNotExist = getUser;

module.exports = {
  getUser,
  saveUser,
  saveIfNotExist
}
