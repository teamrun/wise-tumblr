var util = require('util');
var chalk = require('chalk');

function padStr(str, len){
  if(str.length < len){
    return str + ' '.repeat(len - str.length);
  }
  else{
    return str;
  }
}
const METHOD_LEN = 4;
const ONE_KB = 1024;

module.exports = function(){
  // var colors = 'black,red,green,yellow,blue,magenta,cyan,white,gray'.split(',');
  // colors.forEach(function(c){
  //   console.log(chalk[c](c));
  // });
  return function* reqLogger(next){
    var start = Date.now();

    yield next;

    var method = padStr(this.method, METHOD_LEN);
    var path = this.path;
    var spend = padStr(String(Date.now()-start)+'ms', 5);

    var state = util.format('  %s %s %s %s', chalk.white(method), chalk.green(this.status), chalk.white(spend), chalk.gray(path));

    if(this.response.length){
      // console.log(this.response.length);
      var size = (this.response.length/ONE_KB).toFixed(1) + 'kb';
      state += ' ' + chalk.gray(size);
    }
    console.log(state);
  }
}
