### file proxy
国内访问tumblr的所有资源总是很慢, 接口有GraphQL的实现, 封装一遍最终通过Tokyo的vps来请求, 文件怎么办~?

在这里提供这样的file proxy接口:

`/fileproxy?url=resource_url`

将图片或视频的url放在query里, 服务端会做request pipe, 实现file proxy




!!!貌似polyfill实现的 export和import有点问题!!!
不要用export 和 import!!

用到的es6:
* object简写, 解构
* arrow function
* 
