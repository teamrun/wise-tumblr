var fetchLikes = require('./getter/likes');
var fetchDashboard = require('./getter/dashboard');
var fetchFollowing = require('./getter/following');

module.exports = {
  likes: fetchLikes,
  dashboard: fetchDashboard,
  following: fetchFollowing
};
