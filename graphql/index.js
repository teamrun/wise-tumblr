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
      user: {
        type: UserType,
        args: {
          name: {
            type: new GraphQLNonNull(GraphQLString),
            description: '用户(blog)name'
          }
        },
        resolve: function(obj, param) {
          return co(Service.User.getUser(param.name));
        }
      },
      post: {
        type: PostType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'post id'
          }
        },
        resolve: (obj, param) => {
          return Model.Post.findOne({id: param.id});
        }
      },
      likes: {
        type: new GraphQLList(PostType),
        args: {
          name: {
            type: new GraphQLNonNull(GraphQLString),
            description: '用户名'
          }
        },
        resolve: (obj, param) => {
          return Service.Likes.getUserLikePosts(param.name);
        }
      }
    }
  })
});

module.exports = schema;
