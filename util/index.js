var debug = require('debug')('bench');

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

module.exports = {
    promisefy: promisefy,
    wait: wait
};
