var fetchLikes = require('./getter/likes');
var fetchDashboard = require('./getter/dashboard');

module.exports = {
  likes: fetchLikes,
  dashboard: fetchDashboard
};
