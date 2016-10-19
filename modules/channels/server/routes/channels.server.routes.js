'use strict';

/**
 * Module dependencies
 */
var channelsPolicy = require('../policies/channels.server.policy'),
  channels = require('../controllers/channels.server.controller');

module.exports = function(app) {
  // Channels Routes
  app.route('/api/channels').all(channelsPolicy.isAllowed)
    .get(channels.list)
    .post(channels.create);

  app.route('/api/channels/:channelId').all(channelsPolicy.isAllowed)
    .get(channels.read)
    .put(channels.update)
    .delete(channels.delete);

  // Finish by binding the Channel middleware
  app.param('channelId', channels.channelByID);
};
