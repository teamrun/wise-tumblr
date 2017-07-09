'use strict';

const _ = require('lodash');
const co = require('co');
const GraphQLTypes = require('graphql/type');
const log = console.log.bind(console);


const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList } = GraphQLTypes;


const { UserType, PostType, CommonSucRes } = require('./types/base');
const { LikesRespType, FollowingRespType } = require('./types/complex');

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


// TODO: user validate!! if user exists
var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: {
      // ----------------- demo -----------------
      hello: {
        type: GraphQLString,
        resolve: () => {
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
            description: '(暂时不支持)边界博文的id, 取这个(创建时间)之后的posts'
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
        type: LikesRespType,
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
        type: FollowingRespType,
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
  }),

  // -*-*-*-*-*-*-*-*-*-*-*- mutation -*-*-*-*-*-*-*-*-*-*-*-*-*-
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      unlike: {
        type: CommonSucRes,
        args: _.merge({}, loggedInUser, {
          postId: {
            name: 'id of the post',
            type: GraphQLString
          },
          reblogKey: {
            name: 'reblogKey',
            type: GraphQLString
          }
        }),
        resolve: (obj, param, source, fieldAST) => {
          return Service.unlike(param);
        }
      },
      like: {
        type: CommonSucRes,
        args: _.merge({}, loggedInUser, {
          postId: {
            name: 'id of the post',
            type: GraphQLString
          },
          reblogKey: {
            name: 'reblogKey',
            type: GraphQLString
          }
        }),
        resolve: (obj, param, source, fieldAST) => {
          return Service.like(param);
        }
      }
    }
  })

});

module.exports = schema;
