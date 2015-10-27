module.exports = {
  schema: {
    // The post's unique ID	 ring,
    id:	Number,
    // The short name used to uniquely identify a blog
    blog_name: String,
    // The location of the post
    post_url:String,
    // The type of post	See the type request parameter
    type: String,
    // The time of the post, in seconds since the epoch
    timestamp: Number,
    // The GMT date and time of the post, as a string
    date: Date,
    // The post format: html or markdown
    format: String,
    // The key used to reblog this post	See the /post/reblog method
    reblog_key: String,
    // (string)	Tags applied to the post
    tags: Array,

    // bookmarklet	Boolean	Indicates whether the post was created via the Tumblr bookmarklet	Exists only if true
    // mobile	Boolean	Indicates whether the post was created via mobile/email publishing	Exists only if true

    // The URL for the source of the content (for quotes, reblogs, etc.)	Exists only if there's a content source
    source_url: String,
    // The title of the source site	Exists only if there's a content source
    source_title: String,

    // Indicates if a user has already liked a post or not	Exists only if the request is fully authenticated with OAuth.
    // liked: Boolean,

    // Indicates the current state of the post	States are published, queued, draft and private
    state: String,

    // ------------------ for text type post  -----------------
    title: String,  // The optional title of the post
    body: String,  // The full post body


    // ------------------ for photo type post  -----------------
    photos: Array,   //Photo objects with properties:
        // caption – string: user supplied caption for the individual photo (Photosets only)
        // 500: alternate photo sizes of 500width
        //    width – number: width of the photo, in pixels
        //    height – number: height of the photo, in pixels
        //    url string: Location of the photo file (either a JPG, GIF, or PNG)
        // original_size
        //    width – number: width of the photo, in pixels
        //    height – number: height of the photo, in pixels
        //    url string: Location of the photo file (either a JPG, GIF, or PNG)


    caption: String,   //The user-supplied caption,
    // 文件类型, 方便后面的获取
    // jpg/png/gif的数组
    fileTypes: Array
  },
  indexes: {
    id: 1,
    blog_name: 1
  }
};


// 为了提高速度 我会将图片下载到本地, 图片的存储逻辑为: post id的最后一位为目录名 0~9
// 分开目录存 方便一些
// 以后取图片的时候 只要拼接地址就行
//   pic_url_prefix/0~9/${post_id}_[500/original].[format]
// 图片格式 后缀名.. 怎么搞 三个都去验证吗  JPG, GIF, or PNG
