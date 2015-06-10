'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimeSchema = new Schema({
  date: Date,
  distance: Number,
  duration: Number,
  user_id: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Time', TimeSchema);
