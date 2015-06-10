'use strict';

var _ = require('lodash');
var Time = require('./time.model');

// Get list of times
exports.index = function(req, res) {
  Time.find({user_id: req.user._id}, function (err, times) {
    if(err) { return handleError(res, err); }
    return res.json(200, times);
  });
};

// Get a single time
exports.show = function(req, res) {
  Time.findOne({_id: req.params.id, user_id: req.user._id}, function (err, time) {
    if(err) { return handleError(res, err); }
    if(!time) { return res.send(404); }
    return res.json(time);
  });
};

// Creates a new time in the DB.
exports.create = function(req, res) {
  req.body.user_id = req.user._id;
  Time.create(req.body, function(err, time) {
    if(err) { return handleError(res, err); }
    return res.json(201, time);
  });
};

// Updates an existing time in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Time.findOne({_id: req.params.id, user_id: req.user._id}, function (err, time) {
    if (err) { return handleError(res, err); }
    if(!time) { return res.send(404); }
    var updated = _.merge(time, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, time);
    });
  });
};

// Deletes a time from the DB.
exports.destroy = function(req, res) {
  Time.findOne({_id: req.params.id, user_id: req.user._id}, function (err, time) {
    if(err) { return handleError(res, err); }
    if(!time) { return res.send(404); }
    time.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
