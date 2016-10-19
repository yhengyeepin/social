'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

//List articles from whom I follow
exports.followedList = function (req, res) {

  var user = req.user;
  //console.log('followed list'+user);
  console.log('followed list'+req.body);
  var c = req.param('channelName');


  var followings = [];
  for (var i=0; i< user.following.length;i++) {
    var u = { '_id': user.following[i] };
    followings.push(u);
  }

  //including myself
  followings.push(user._id);

  //if channel name is given, use it to filter
  if (typeof c !== 'undefined' && c !== null) {
    console.log('followed list channel name:'+c);
    if (c === 'General') {
      Article.find().sort('-created').populate('user', 'displayName profileImageURL').exec(function (err, articles) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(articles);
        }
      });
    } else {
      Article.find({ channelName: { $eq:c } }).where('user').in(followings).sort('-created').populate('user', 'displayName profileImageURL').exec(function (err, articles) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(articles);
        }
      });
    }
    //.where('channelName').equals(channelName)

  } else {
    Article.find().sort('-created').populate('user', 'displayName profileImageURL').where('user').in(followings).exec(function (err, articles) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(articles);
      }
    });
  }
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  console.log('list articles');
  Article.find().sort('-created').populate('user', 'displayName profileImageURL').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName profileImageURL').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};
