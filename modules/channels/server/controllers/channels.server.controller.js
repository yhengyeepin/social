'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Channel = mongoose.model('Channel'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Channel
 */
exports.create = function(req, res) {
  var channel = new Channel(req.body);
  channel.user = req.user;

  channel.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(channel);
    }
  });
};

/**
 * Show the current Channel
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var channel = req.channel ? req.channel.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  channel.isCurrentUserOwner = req.user && channel.user && channel.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(channel);
};

/**
 * Update a Channel
 */
exports.update = function(req, res) {
  var channel = req.channel ;

  channel = _.extend(channel , req.body);

  channel.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(channel);
    }
  });
};

/**
 * Delete an Channel
 */
exports.delete = function(req, res) {
  var channel = req.channel ;

  channel.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(channel);
    }
  });
};

/**
 * List of Channels
 */
exports.list = function(req, res) { 
  Channel.find().sort('-created').populate('user', 'displayName').exec(function(err, channels) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(channels);
    }
  });
};

/**
 * Channel middleware
 */
exports.channelByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Channel is invalid'
    });
  }

  Channel.findById(id).populate('user', 'displayName').exec(function (err, channel) {
    if (err) {
      return next(err);
    } else if (!channel) {
      return res.status(404).send({
        message: 'No Channel with that identifier has been found'
      });
    }
    req.channel = channel;
    next();
  });
};
