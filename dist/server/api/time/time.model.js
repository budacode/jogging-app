'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimeSchema = new Schema({
  date: Date,
  distance: Number,
  duration: Number
});

module.exports = mongoose.model('Time', TimeSchema);
