module.exports = {
  schema: {
    // 用户名
    user_name:  String,
    // 用户follow的其他blog的name
    blog_name:  String,
    dt_create: Date
  },
  indexes: {
    user_name: 1,
    // dt_like: 1
  }
};
