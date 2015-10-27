var views = require('co-views');

module.exports = views(config.appPath + '/views', {
  default: 'jade',
  cache: (config.env === 'production')? true : false
});
