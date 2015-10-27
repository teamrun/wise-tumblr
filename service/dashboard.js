// var client = require('../util/client');
//
// function* fetchDashboard(query){
//   query = query || {};
//   var resp = yield client(query);
// }
//
// function* fetchSinceLastTime(){
//   var lastId;
//   // query for last id
//   yield fetchDashboard({
//     since_id: lastId
//   });
// }

// 定时任务怎么来做? 每小时取一次, 记住最后一个的id
