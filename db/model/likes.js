module.exports = {
    schema: {
        user_name:  String,
        post_id:    Number,
        // like的时间戳 秒
        liked_timestamp: Number
    },
    indexes: {
        // user_name: 1,
        // dt_like: 1
    }
}
