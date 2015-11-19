var _ = require('lodash');
var co = require('co');
var GraphQLTypes = require('graphql/type');


const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList } = GraphQLTypes;


var {UserType, PostType} = require('./types');

const loggedInUser = {
  user: {
    type: new GraphQLNonNull(GraphQLString),
    description: '当前用户名'
  }
};

const blogNameArg = {
  name: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'blog name'
  }
}
var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: function() {
          return 'world';
        }
      },
      blogInfo: {
        type: UserType,
        args: blogNameArg,
        resolve: (obj, param) => {
          return Service.blogInfo(param.name);
        }
      },

      avatar: {
        type: GraphQLString,
        args: _.assign({
          size: {
            type: GraphQLInt,
            description: '尺寸'
          }
        }, blogNameArg),
        resolve: (obj, param) => {
          param.size = param.size || 128;
          return Service.avatar(param);
        }
      },

      dashboard: {
        type: new GraphQLList(PostType),
        // 获取最新的posts: 不传sinceId, 只传limit
        // 下拉加载更多: 传sinceId, 传limit
        args: _.assign({}, loggedInUser, {
          siceId: {
            type: GraphQLInt,
            description: '边界博文的id, 取这个之前的posts'
          },
          limit: {
            type: GraphQLInt,
            description: '取多少个, 默认为20'
          }
        }),
        resolve: (obj, param) => {
          return Service.dashboard(param.user, param.sinceId, param.limit);
        }
      }

      // ----------- query ends here -----------
    }
  })
});

module.exports = schema;
