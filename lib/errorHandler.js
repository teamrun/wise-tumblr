'use strict';

module.exports = function* (next){
  try{
    yield next;

    if(this.status === 404 && (this.is('html') || this.type === '')){
      this.status = 404;
      this.body = yield render('error/404');
    }
  }
  catch(e){
    console.error('caught error: ', e.stack || e);
    if(this.is('json')){
      this.body = {
        code: 500,
        message: 'server got error'
      };
    }
    else{
      this.body = yield render('error/500', {
        stack: e.stack || e
      });
    }
  }
};
