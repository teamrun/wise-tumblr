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
      }
    }
  })
});

module.exports = schema;
