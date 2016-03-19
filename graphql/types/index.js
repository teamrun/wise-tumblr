var path = require('path');

var _ = require('lodash');
var moment = require('moment');
var types = require('graphql/type');


const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList } = types;


const host = (process.env.NODE_ENV === 'production')? 'http://chenllos.com:9016' : 'http://localhost:9016';
let processResourceUrl = (url) => {
  return host + '/fileproxy?url=' + url;
};



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
      avatar: {
        type: GraphQLString,
        description: '头像',
        // 这里还可以再定义参数!!!!
        // 跟schema中的GraphQLObjectType一样
        // 访问每一个属性都可以添加参数
        args: {
          size: {
            type: GraphQLInt
          }
        },
        resolve: (user, param) => {
          let name = user.name;
          let size = param.size;
          return Service.avatar({name, size})
            .then((url) => {
              return processResourceUrl(url);
            });
        }
      }
    };
  }
});

let ImageType = new GraphQLObjectType({
  name: 'Image',
  description: '图片资源 包括: url, width, height',
  fields: () => {
    return {
      url: {
        type: GraphQLString,
        resolve: (img) => {
          return processResourceUrl(img.url);
        }
      },
      width: {type: GraphQLInt},
      height: {type: GraphQLInt}
    };
  }
});

let PhotoResourceType = new GraphQLObjectType({
  name: 'PostPhoto',
  description: 'post的图片 抽象出的类型',
  fields: () => {
    return {
      caption: {
        type: GraphQLString,
        description: '图片说明'
      },
      alt_sizes: {
        type: new GraphQLList(ImageType),
        description: '其他可选尺寸的图片',
        resolve: (resource) => {
          return resource.alt_sizes;
        }
      },
      thumbnail: {
        type: ImageType,
        description: '缩略尺寸的图片',
        resolve: (resource) => {
          return resource.alt_sizes[1];
        }
      },
      original_size: {
        type: ImageType,
        description: '大尺寸的图片',
        resolve: (resource) => {
          return resource.original_size;
        }
      }
    };
  }
});

let PlayerItemType = new GraphQLObjectType({
  name: 'PlayerItem',
  description: '视频播放器or资源item',
  fields: () => {
    return {
      width: {
        type: GraphQLInt,
        description: '宽度'
      },
      embed_code: {
        type: GraphQLString,
        description: 'string: HTML for embedding the video player'
      }
    };
  }
})

// 将post对象的所有属性拿出来 方便复用
let _post_obj_fields = {
  id: {
    type: GraphQLString,
    description: 'id, 唯一标识',
  },
  blog_name: {
    type: GraphQLString,
    description: '发布者的名字',
  },
  post_url: {
    type: GraphQLString,
    description: 'post的页面地址 定位到这个post的tumblr页面',
  },
  type: {
    type: GraphQLString,
    description: '类型 text/photo/video',
  },
  timestamp: {
    type: GraphQLInt,
    description: '发布的时间戳 秒',
  },
  date: {
    type: GraphQLString,
    description: '发布时间',
  },
  format: {
    type: GraphQLString,
    description: '文本格式 html/markdown',
  },
  reblog_key: {
    type: GraphQLString,
    description: '转发标识',
  },
  tags: {
    type: new GraphQLList(GraphQLString),
    description: 'tag数组',
  },

  state: {
    type: GraphQLString,
    description: 'post状态 已发布 还是草稿'
  },
  title: {
    type: GraphQLString,
    description: 'post标题'
  },  // The optional title of the post
  body: {
    type: GraphQLString,
    description: '正文'
  },  // The full post body
  photos: {
    type: new GraphQLList(PhotoResourceType),
    description: 'post 图片',
    resolve: function(post){
      if(post.type !== 'photo'){
        return [];
      }
      return post.photos.map(function(item, i){
        return _.assign({}, item, {
          postId: post.id,
          index: i
        });
      });
    }
  },
  caption: {
    type: GraphQLString,
    description: 'photo or video的描述'
  },
  player: {
    type: new GraphQLList(PlayerItemType),
    description: '视频播放器or资源',
    resolve: function(post){
      if(post.type !== 'video'){
        return [];
      }
      return post.player;
    }
  }
};

let PostType = new GraphQLObjectType({
  name: 'Post',
  description: '发布的post的模型',
  fields: () => {
    return _post_obj_fields;
  }
});

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

let LikesType = new GraphQLObjectType({
  name: 'Likes',
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

module.exports = {
  UserType,
  PostType,
  LikesType
};
