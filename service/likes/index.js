var LikesModel = Model.Likes;

function getLatest(name){
    return LikesModel.findOne().sort({ liked_timestamp: -1 });
}

//
var defaultOpt = {skip: 0, limit: 20};
function getUserLikes(name, opt){
    opt = _.assign({}, defaultOpt, opt);

    return LikesModel.find({
            user_name: name
        })
        .sort({ liked_timestamp: -1 })
        .limit(opt.limit)
        .skip(opt.skip);
}

module.exports = {
    getLatest: getLatest,
    getUserLikes: getUserLikes
}
