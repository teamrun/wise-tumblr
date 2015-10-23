// 批量保存posts
// 缓存图片
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var request = require('request');

var WRITE_FILE_PATH = '/Users/chenllos/Documents/tumblr';

// 从获取的网络response中构建doc
function buildPostDoc(item){
    // 是否是图片类型的post
    if(item.type === 'photo'){
        // 精简图片信息, 只保留原图和500宽的图
        var photos = item.photos;
        delete item.photos;
        item.photos = photos.map(function(item){
            return {
                caption: item.caption,
                500: _.find(item.alt_sizes, function(p){
                    return p.width === 500;
                }),
                original: item.original_size
            }
        });

        // 构建一个数组 里面存储图片类型
        var typesArr = photos.map(function(item){
            return path.extname(item.original_size.url).replace('.', '');
        });
        item.fileTypes = typesArr;
    }


    return item;
}

// 将网络文件写到本地
function saveNetfile(url, filePath){
    return new Promise(function(resolve, reject){
        var ws = fs.createWriteStream(filePath);
        request.get({
            url: url,
            timeout: 10 * 1000
        }).on('close', function() {
                console.log(`save file ${path.basename(filePath)}  done`);
                resolve();
            })
            .on('error', function(err){
                // 遇到error一样resolve, 老是有图片fetch不到
                console.log(`get file error: '${url}: `, err.message || err);
                fs.unlink(filePath);

                resolve();
            })
            .pipe(ws);
    });
}

function* downloadPostFiles(post){
    if(post.type === 'photo'){
        var postId = post.id;
        var fileTypes = post.fileTypes;
        var urls = post.photos.map(function(item){
            return {
                500: item['500'].url,
                original: item.original.url
            }
        });

        yield urls.map(function(item, index){
            return {
                500: saveNetfile(item['500'], `${WRITE_FILE_PATH}/${postId}_${index}_500.${fileTypes[index]}`),
                original: saveNetfile(item['original'], `${WRITE_FILE_PATH}/${postId}_${index}_original.${fileTypes[index]}`),
            }
        });
    }
    else{
        console.log('could not download because type is', post.type);
    }
}

function* saveOne(p){
    var doc = buildPostDoc(p);

    var model = new Model.Post(doc);
    yield {
        file: downloadPostFiles(doc),
        db: model.save()
    };
    console.log(`save post ${p.id}'s files & doc done`);
}

function* savePosts(posts){
    while(posts.length > 0){
        var somePost = posts.splice(0, 5);
        yield somePost.map(function(item){
            return saveOne(item);
        });

    }
    console.log(`save ${posts.length} posts done! `)
}

module.exports = savePosts;
