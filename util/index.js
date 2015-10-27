var fs = require('fs');
var path = require('path');

var debug = require('debug')('bench');
var Got = require('got');

function promisefy(asyncFn, ctx){
    return function(){
        var args = [].slice.call(arguments);
        var start = Date.now();
        return new Promise(function(resolve, reject){
            asyncFn.apply(ctx, args.concat(function(err, data){
                debug(`spent: ${Date.now() - start}ms`);
                err? reject(err) : resolve(data);
            }));
        });
    }
}

function wait(time){
    return new Promise(function(resolve, rejact){
        setTimeout(function(){
            resolve();
        }, time);
    });
}

function removeFile(file){
    console.log('remove file', file)
    fs.unlink(file, function(err, data){});
}


function gotFile(url, file){
    return new Promise(function(resolve, reject){
        var readStream = Got.stream(url, {timeout: 6*1000});
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

module.exports = {
    promisefy,
    wait,
    gotFile
};
