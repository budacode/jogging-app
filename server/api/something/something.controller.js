'use strict';

var _ = require('lodash');
var Something = require('./something.model');

// Get list of somethings
exports.index = function(req, res) {
  Something.find(function (err, somethings) {
    if(err) { return handleError(res, err); }
    return res.json(200, somethings);
  });
};

// Get a single something
exports.show = function(req, res) {
  Something.findById(req.params.id, function (err, something) {
    if(err) { return handleError(res, err); }
    if(!something) { return res.send(404); }
    return res.json(something);
  });
};

// Creates a new something in the DB.
exports.create = function(req, res) {
  Something.create(req.body, function(err, something) {
    if(err) { return handleError(res, err); }
    return res.json(201, something);
  });
};

// Updates an existing something in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Something.findById(req.params.id, function (err, something) {
    if (err) { return handleError(res, err); }
    if(!something) { return res.send(404); }
    var updated = _.merge(something, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, something);
    });
  });
};

// Deletes a something from the DB.
exports.destroy = function(req, res) {
  Something.findById(req.params.id, function (err, something) {
    if(err) { return handleError(res, err); }
    if(!something) { return res.send(404); }
    something.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}