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


var {UserType, PostType, LikesType} = require('./types');

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
};
var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: {
      // ----------------- demo -----------------
      hello: {
        type: GraphQLString,
        resolve: function() {
          return 'world';
        }
      },
      // ----------------- blog信息 -----------------
      blogInfo: {
        type: UserType,
        args: blogNameArg,
        resolve: (obj, param) => {
          return Service.blogInfo(param.name);
        }
      },

      // ----------------- blog头像 -----------------
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

      // ----------------- 关注人的最新posts -----------------
      dashboard: {
        type: new GraphQLList(PostType),
        // 获取最新的posts: 不传sinceId, 只传limit
        // 下拉加载更多: 传sinceId, 传limit
        args: _.merge({}, loggedInUser, {
          sinceId: {
            type: GraphQLInt,
            description: '边界博文的id, 取这个(创建时间)之后的posts'
          },
          limit: {
            type: GraphQLInt,
            description: '取多少个, 默认为20'
          },
          offset: {
            type: GraphQLInt,
            description: '跳过多少个'
          }
        }),
        resolve: (obj, param) => {
          return Service.dashboard(param);
        }
      },
      // ----------------- 本人like了的posts -----------------
      likes: {
        type: LikesType,
        /*
          获取的时候 一直是从最新liked的开始拿的
          可用after来检查是否有最新的likes
        */
        args:  _.merge({}, loggedInUser, {
          after: {
            type: GraphQLInt,
            description: '边界参数 三选一 在这个秒之后like的posts'
          },
          before: {
            type: GraphQLInt,
            description: '边界参数 三选一 在这个秒之前like的posts'
          },
          offset: {
            type: GraphQLInt,
            description: '边界参数 三选一 跳过多少个'
          },
          limit: {
            type: GraphQLInt,
            description: '取多少个, 默认为20'
          }
        }),
        resolve: (obj, param) => {
          return Service.likes(param);
        }
      },
      // ----------------- 本人关注了哪些人 -----------------
      following: {
        type: new GraphQLObjectType({
          name: 'following',
          fields: {
            blogs: {
              type: new GraphQLList(UserType),
              description: '关注的人们',
            },
            total_blogs: {
              type: GraphQLInt,
              description: '关注总数'
            }
          }
        }),
        args: _.merge({}, loggedInUser, {
          skip: {
            type: GraphQLInt,
            description: '边界参数 跳过多少'
          },
          limit: {
            type: GraphQLInt,
            description: '获取多少个 默认20'
          }
        }),
        resolve: (obj, param) => {
          return Service.following(param);
        }
      }

      // ----------- query ends here -----------
    }
  })
});

module.exports = schema;
