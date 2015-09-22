var app = require('koa')();

app.use(function* (){
    this.body = 'wise-tumblr-server response!'
});

var port = 9016;
app.listen(port, function(){
    console.log('server is listening at: %d', port);
});