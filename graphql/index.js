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
    }
  })
});

module.exports = schema;
