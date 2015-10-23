var co = require('co');
var GraphQLTypes = require('graphql/type');

var GraphQLObjectType = GraphQLTypes.GraphQLObjectType,
    GraphQLNonNull = GraphQLTypes.GraphQLNonNull,
    GraphQLSchema = GraphQLTypes.GraphQLSchema,
    GraphQLString = GraphQLTypes.GraphQLString,
    GraphQLBoolean = GraphQLTypes.GraphQLBoolean,
    GraphQLInt = GraphQLTypes.GraphQLInt,
    GraphQLList = GraphQLTypes.GraphQLList;

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
            car: {
                type: Types.CarType,
                args: {
                    id: {
                        type: GraphQLString,
                        description: '车辆id'
                    },
                    vin: {
                        type: GraphQLString,
                        description: '车辆vin码'
                    }
                },
                resolve: function(obj, param) {
                    // 暂时还不支持vin码查车
                    return CarService.getCarDetail(param.id);
                }
            }
        }
    }),

    // mutation
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createQA: {
                type: Types.QARecordType,
                args: {
                    order_code: {
                        name: 'order_code',
                        type: GraphQLString
                    },
                    need_validate: {
                        name: 'need_validate',
                        type: GraphQLBoolean
                    },
                    comment: {
                        name: 'comment',
                        type: GraphQLString,
                        description: '备注信息'
                    },
                    operator: {
                        name: 'operator',
                        type: GraphQLString,
                        description: '操作者'
                    },
                    demander: {
                        name: 'demander',
                        type: GraphQLString,
                        description: '谁要求的进行此次操作'
                    }
                },
                resolve: function(obj, param, source, fieldASTs){
                    // console.log('[param]', param);
                    return co(QarecordService.createByOrder(param));
                }
            }
        }
    })
});

module.exports = schema;
