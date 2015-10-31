var co = require('co');
var _ = require('lodash');

require('../../lib');

var needCleanDBs = 'user,post,likes,follow';

function clearDB(){
  return co(function*(){
  yield needCleanDBs.split(',').map(function(item){
    var modelName = _.capitalize(item);
    return Model[modelName].remove();
  });

  console.log('db clean done:', needCleanDBs);
  });
}


module.exports = clearDB;
