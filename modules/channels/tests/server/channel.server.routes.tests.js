'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Channel = mongoose.model('Channel'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, channel;

/**
 * Channel routes tests
 */
describe('Channel CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Channel
    user.save(function () {
      channel = {
        name: 'Channel name'
      };

      done();
    });
  });

  it('should be able to save a Channel if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Channel
        agent.post('/api/channels')
          .send(channel)
          .expect(200)
          .end(function (channelSaveErr, channelSaveRes) {
            // Handle Channel save error
            if (channelSaveErr) {
              return done(channelSaveErr);
            }

            // Get a list of Channels
            agent.get('/api/channels')
              .end(function (channelsGetErr, channelsGetRes) {
                // Handle Channel save error
                if (channelsGetErr) {
                  return done(channelsGetErr);
                }

                // Get Channels list
                var channels = channelsGetRes.body;

                // Set assertions
                (channels[0].user._id).should.equal(userId);
                (channels[0].name).should.match('Channel name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Channel if not logged in', function (done) {
    agent.post('/api/channels')
      .send(channel)
      .expect(403)
      .end(function (channelSaveErr, channelSaveRes) {
        // Call the assertion callback
        done(channelSaveErr);
      });
  });

  it('should not be able to save an Channel if no name is provided', function (done) {
    // Invalidate name field
    channel.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Channel
        agent.post('/api/channels')
          .send(channel)
          .expect(400)
          .end(function (channelSaveErr, channelSaveRes) {
            // Set message assertion
            (channelSaveRes.body.message).should.match('Please fill Channel name');

            // Handle Channel save error
            done(channelSaveErr);
          });
      });
  });

  it('should be able to update an Channel if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Channel
        agent.post('/api/channels')
          .send(channel)
          .expect(200)
          .end(function (channelSaveErr, channelSaveRes) {
            // Handle Channel save error
            if (channelSaveErr) {
              return done(channelSaveErr);
            }

            // Update Channel name
            channel.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Channel
            agent.put('/api/channels/' + channelSaveRes.body._id)
              .send(channel)
              .expect(200)
              .end(function (channelUpdateErr, channelUpdateRes) {
                // Handle Channel update error
                if (channelUpdateErr) {
                  return done(channelUpdateErr);
                }

                // Set assertions
                (channelUpdateRes.body._id).should.equal(channelSaveRes.body._id);
                (channelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Channels if not signed in', function (done) {
    // Create new Channel model instance
    var channelObj = new Channel(channel);

    // Save the channel
    channelObj.save(function () {
      // Request Channels
      request(app).get('/api/channels')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Channel if not signed in', function (done) {
    // Create new Channel model instance
    var channelObj = new Channel(channel);

    // Save the Channel
    channelObj.save(function () {
      request(app).get('/api/channels/' + channelObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', channel.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Channel with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/channels/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Channel is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Channel which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Channel
    request(app).get('/api/channels/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Channel with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Channel if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Channel
        agent.post('/api/channels')
          .send(channel)
          .expect(200)
          .end(function (channelSaveErr, channelSaveRes) {
            // Handle Channel save error
            if (channelSaveErr) {
              return done(channelSaveErr);
            }

            // Delete an existing Channel
            agent.delete('/api/channels/' + channelSaveRes.body._id)
              .send(channel)
              .expect(200)
              .end(function (channelDeleteErr, channelDeleteRes) {
                // Handle channel error error
                if (channelDeleteErr) {
                  return done(channelDeleteErr);
                }

                // Set assertions
                (channelDeleteRes.body._id).should.equal(channelSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Channel if not signed in', function (done) {
    // Set Channel user
    channel.user = user;

    // Create new Channel model instance
    var channelObj = new Channel(channel);

    // Save the Channel
    channelObj.save(function () {
      // Try deleting Channel
      request(app).delete('/api/channels/' + channelObj._id)
        .expect(403)
        .end(function (channelDeleteErr, channelDeleteRes) {
          // Set message assertion
          (channelDeleteRes.body.message).should.match('User is not authorized');

          // Handle Channel error error
          done(channelDeleteErr);
        });

    });
  });

  it('should be able to get a single Channel that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Channel
          agent.post('/api/channels')
            .send(channel)
            .expect(200)
            .end(function (channelSaveErr, channelSaveRes) {
              // Handle Channel save error
              if (channelSaveErr) {
                return done(channelSaveErr);
              }

              // Set assertions on new Channel
              (channelSaveRes.body.name).should.equal(channel.name);
              should.exist(channelSaveRes.body.user);
              should.equal(channelSaveRes.body.user._id, orphanId);

              // force the Channel to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Channel
                    agent.get('/api/channels/' + channelSaveRes.body._id)
                      .expect(200)
                      .end(function (channelInfoErr, channelInfoRes) {
                        // Handle Channel error
                        if (channelInfoErr) {
                          return done(channelInfoErr);
                        }

                        // Set assertions
                        (channelInfoRes.body._id).should.equal(channelSaveRes.body._id);
                        (channelInfoRes.body.name).should.equal(channel.name);
                        should.equal(channelInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Channel.remove().exec(done);
    });
  });
});
