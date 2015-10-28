var co = require('co');
var debug = require('debug')('cron');
var moment = require('moment');
var requireDir = require('require-dir');

var clientConf = require('../config').tumblr;
var creator = require('./clientCreator');
var Fetcher = require('../service/fetch');
var cleaner = requireDir('./cleaner');

var clients = [];

if(Array.isArray(clientConf)){
  clients = clientConf.map(function(item){
  var c = creator(item);
  c.name = item.name;
  return c;
  });
}
else{
  var c = creator(clientConf);
  c.name = clientConf.name;
  clients.push(c);
}
debug(`init clients done! total ${clients.length}`);


function* fetchSchedual(client){
  yield Fetcher.dashboard(client);
  // yield Fetcher.likes(client);
}



co(function*(){
  // 清理数据库
  // yield cleaner.db();

  for(var i=0; i<clients.length; i++){
    var C = clients[i];
    yield fetchSchedual(C);
  }

  debug('fetchSchedual of %d client(s) done! at %s', clients.length, moment().format('YYYY-MM-DD HH:mm:ss'));
})
.catch(function(err){
  console.log('err', err.stack || err);
})
