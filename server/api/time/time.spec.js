'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var TimeModel = require('./time.model');

// Need to test: CREATE / READ / DELETE

var testTimeRecord = {
  date: new Date(),
  distance: 10,
  duration: 59
};

var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTY4NjdmYjc5MmU5OTMwNDRlNjViZTQiLCJpYXQiOjE0MzI5MDU3NDE5NTEsImV4cCI6MTQzMjkyMzc0MTk1MX0.IRAMaJFTkm48bdw-oHGmARHntUVyU1KoiTc9sXDh39o";

//before(function(done) {
//  request(app)
//    .post('/auth/local')
//    .field('email', 'admin@admin.com')
//    .field('password', 'admin')
//    .end(function(err, res){
//      token = res.body.token;
//      console.log('TOKEEEEEEN', token, res.body);
//      //done();
//    });
//});

describe('POST /api/times', function() {
  before(function(done) {
    // Clear before testing
    TimeModel.remove().exec().then(function() {
      done();
    });
  });

  it('should insert one element', function(done) {
    request(app)
      .post('/api/times')
      .set('Authorization', 'Bearer ' + token)
      .field('date', testTimeRecord.date)
      .field('distance', testTimeRecord.distance)
      .field('duration', testTimeRecord.duration)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);

        TimeModel.find({}, function(err, timeRecords) {
          timeRecords.should.have.length(1);
          String(res.body._id).should.equal(String(timeRecords[0]._id));

          testTimeRecord = res.body;
          done();
        });
      });
  });
});


describe('GET /api/times', function() {
  before(function(done) {
    // Clear before testing
    TimeModel.remove().exec().then(function() {
      done();
    });
  });

  before(function(done){
    var record = new TimeModel(testTimeRecord);
    record.save(function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('should respond with JSON array - with one element', function(done) {
    request(app)
      .get('/api/times')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.length.should.equal(1);
        done();
      });
  });
});


describe('DELETE /api/times/:id', function() {
  before(function(done) {
    // Clear before testing
    TimeModel.remove().exec().then(function() {
      done();
    });
  });

  before(function(done){
    var record = new TimeModel(testTimeRecord);
    record.save(function(err, result) {
      should.not.exist(err);
      testTimeRecord = result;
      done();
    });
  });

  it('should delete the only element', function(done) {
    request(app)
      .delete('/api/times/' + testTimeRecord._id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)
      //.expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);

        TimeModel.find({}, function(err, timeRecords) {
          timeRecords.should.have.length(0);
          done();
        });
      });
  });

});
