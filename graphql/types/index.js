var moment = require('moment');
var types = require('graphql/type');

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList } = types;



var UserType = new GraphQLObjectType({
  name: 'User',
  description: 'tumblr用户, 相当于api中的blog',
  fields: function(){
    return {
      name: {
        type: GraphQLString,
        description: '用户名 唯一'
      },
      title: {
        type: GraphQLString,
        description: '标题 blog名字 或者 像签名'
      },
      description: {
        type: GraphQLString,
        description: '详细描述'
      },
      url: {
        type: GraphQLString,
        description: 'tumblr主页链接地址'
      },
      likes:  {
        type: GraphQLInt,
        description: 'likes的个数'
      },
      avatar: {
        type: GraphQLInt,
        description: '头像地址'
      }
    }
  }
});

module.exports = {
  UserType
};
