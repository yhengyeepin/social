'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reply Schema
 */
var ReplySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Reply name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  article: {
    type: Schema.ObjectId,
    ref: 'Article'
  }
});

mongoose.model('Reply', ReplySchema);
