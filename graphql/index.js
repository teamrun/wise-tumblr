var co = require('co');
var GraphQLTypes = require('graphql/type');


const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList } = GraphQLTypes;


var Types = require('./types');


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
        type: Types.UserType,
        args: {
          name: {
            type: new GraphQLNonNull(GraphQLString),
            description: '用户(blog)name'
          }
        },
        resolve: function(obj, param) {
          return co(Service.User.getUser(param.name));
        }
      }
    }
  })
});

module.exports = schema;
