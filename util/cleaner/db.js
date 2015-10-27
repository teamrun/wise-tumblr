var co = require('co');
var _ = require('lodash');

require('../../lib');

var needCleanDBs = 'users,posts,likes';

function clearDB(){
  return co(function*(){
  yield needCleanDBs.split(',').map(function(){
    var modelName = _.capitalize()
    return Model[modelName].remove();
  });

  console.log('db clean done:', needCleanDBs);
  });
}


module.exports = clearDB();
