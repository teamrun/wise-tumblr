// 批量保存posts
// 缓存图片
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var Got = require('got');
var Download = require('download');
var request = require('request');

var WRITE_FILE_PATH = config.savePath;

var ERROR_DATA = {};

// 将错误记录下来
function logErr(type, url, filePath){
    if(ERROR_DATA[type]){
        ERROR_DATA[type].push({
            url: url,
            name: path.basename(filePath)
        });
    }
    else{
        ERROR_DATA[type] = [{
            url: url,
            name: path.basename(filePath)
        }];
    }
}

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
                    // return p.width === 100;
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

function removeFile(file){
    console.log('remove file', file)
    fs.unlink(file, function(err, data){});
}

function gotOneFile(url, file){
    return new Promise(function(resolve, reject){
        var readStream = Got.stream(url, {timeout: 10*1000});
        readStream.on('error', reject);
        readStream.on('error', function(err){
            console.log('got file error: ' + err.message + err.stack);
            removeFile(file);
            resolve();
        });

        var writeStream = fs.createWriteStream(file);
        writeStream.on('finish', resolve);

        readStream.pipe(writeStream);
    });
}
// 将网络文件写到本地
function saveNetfiles(urlNamePairs, filePath){
    // return new Promise(function(resolve, reject){
        // var dl = new Download({
        //     mode: '755',
        //     timeout: 3*1000,
        //     pool: {
        //         maxSockets: Infinity
        //     }
        // });
        //
        // params.forEach(function(url){
        //     dl.get(url);
        // });
        //
        // dl.dest(filePath)
        // .run(function(err, data){
        //     if(err){
        //         // console.log(`download file error: ${fileName}: `, err.message || err);
        //         // logErr(err.message, url, fileName);
        //         resolve();
        //     }
        //     else{
        //         console.log(`write done!`);
        //         resolve();
        //     }
        // });
    // });
    var promiseArr = [];
    for(var url in urlNamePairs){
        var name = urlNamePairs[url];
        promiseArr.push( gotOneFile(url, path.join(filePath, name )) );
    }
    return promiseArr;
}


function* downloadPostFiles(post){
    if(post.type === 'photo'){
        var postId = post.id;
        var fileTypes = post.fileTypes;

        var count = 0;

        // var downloadPromises = post.photos.map(function(item, i){
        var fileUrls = {};
        post.photos.forEach(function(item, i){
            var pArr = [];

            if(item['500'] && item['500'].url){
                count++;
                fileUrls[item['500'].url] = `${postId}_${i}_500.${fileTypes[i]}`;

            }
            if(item.original && item.original.url){
                count++;
                fileUrls[item.original.url] = `${postId}_${i}_original.${fileTypes[i]}`;
            }
        });
        console.log(`run ${count} threads to download file`);
        yield saveNetfiles(fileUrls, WRITE_FILE_PATH);
    }
    else{
        console.log('could not download because type is', post.type);
    }
}

function* saveOne(p){
    var doc = buildPostDoc(p);

    var query = {
        id: p.id
    };
    yield {
        file: downloadPostFiles(doc),
        db: Model.Post.update(query, doc, {upsert: true})
    };
    console.log(`save post ${p.id}'s files & doc done`);
}

function* savePosts(posts){
    var totalCount = posts.length;

    while(posts.length > 0){
        var somePost = posts.splice(0, 5);
        yield somePost.map(function(item){
            return saveOne(item);
        });
        console.log(`---------- done with ${somePost.length} posts`);
    }
    console.log(`save ${totalCount} posts done! `);

    fs.writeFile(`${config.appPath}/test/save_post_err.json`, JSON.stringify(ERROR_DATA, null, 4), function(){
        console.log('error saved');
    });
}

module.exports = savePosts;
