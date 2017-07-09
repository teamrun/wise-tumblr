'use strict';

const path = require('path');

const _ = require('lodash');
const moment = require('moment');
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList } = require('graphql/type');

const {
  UserType,
  PostType,
  _post_obj_fields
} = require('./base');


let LikedPostType = new GraphQLObjectType({
  name: 'LikedPostType',
  description: 'likes 返回的post数据, 比原始的post多一些属性',
  fields: _.merge({}, _post_obj_fields, {
    liked_timestamp: {
      type: GraphQLInt,
      description: 'like操作的时间 unix秒'
    }
  })
});

let LikesRespType = new GraphQLObjectType({
  name: 'LikesResp',
  description: '获取likes的返回数据 封装了post list 和 liked_coutn',
  fields: {
    liked_posts: {
      type: new GraphQLList(LikedPostType),
      description: 'like了的post的列表'
    },
    liked_count: {
      type: GraphQLInt,
      description: 'like了的个数'
    },
  }
});

const FollowingRespType = new GraphQLObjectType({
  name: 'FollowingResp',
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
});

module.exports = {
  LikesRespType,
  FollowingRespType
};
