'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Hpo = mongoose.model('Hpo'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, hpo;

/**
 * Hpo routes tests
 */
describe('Hpo CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
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

		// Save a user to the test db and create new Hpo
		user.save(function() {
			hpo = {
				name: 'Hpo Name'
			};

			done();
		});
	});

	it('should be able to save Hpo instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hpo
				agent.post('/hpos')
					.send(hpo)
					.expect(200)
					.end(function(hpoSaveErr, hpoSaveRes) {
						// Handle Hpo save error
						if (hpoSaveErr) done(hpoSaveErr);

						// Get a list of Hpos
						agent.get('/hpos')
							.end(function(hposGetErr, hposGetRes) {
								// Handle Hpo save error
								if (hposGetErr) done(hposGetErr);

								// Get Hpos list
								var hpos = hposGetRes.body;

								// Set assertions
								(hpos[0].user._id).should.equal(userId);
								(hpos[0].name).should.match('Hpo Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Hpo instance if not logged in', function(done) {
		agent.post('/hpos')
			.send(hpo)
			.expect(401)
			.end(function(hpoSaveErr, hpoSaveRes) {
				// Call the assertion callback
				done(hpoSaveErr);
			});
	});

	it('should not be able to save Hpo instance if no name is provided', function(done) {
		// Invalidate name field
		hpo.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hpo
				agent.post('/hpos')
					.send(hpo)
					.expect(400)
					.end(function(hpoSaveErr, hpoSaveRes) {
						// Set message assertion
						(hpoSaveRes.body.message).should.match('Please fill Hpo name');
						
						// Handle Hpo save error
						done(hpoSaveErr);
					});
			});
	});

	it('should be able to update Hpo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hpo
				agent.post('/hpos')
					.send(hpo)
					.expect(200)
					.end(function(hpoSaveErr, hpoSaveRes) {
						// Handle Hpo save error
						if (hpoSaveErr) done(hpoSaveErr);

						// Update Hpo name
						hpo.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Hpo
						agent.put('/hpos/' + hpoSaveRes.body._id)
							.send(hpo)
							.expect(200)
							.end(function(hpoUpdateErr, hpoUpdateRes) {
								// Handle Hpo update error
								if (hpoUpdateErr) done(hpoUpdateErr);

								// Set assertions
								(hpoUpdateRes.body._id).should.equal(hpoSaveRes.body._id);
								(hpoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Hpos if not signed in', function(done) {
		// Create new Hpo model instance
		var hpoObj = new Hpo(hpo);

		// Save the Hpo
		hpoObj.save(function() {
			// Request Hpos
			request(app).get('/hpos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Hpo if not signed in', function(done) {
		// Create new Hpo model instance
		var hpoObj = new Hpo(hpo);

		// Save the Hpo
		hpoObj.save(function() {
			request(app).get('/hpos/' + hpoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', hpo.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Hpo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hpo
				agent.post('/hpos')
					.send(hpo)
					.expect(200)
					.end(function(hpoSaveErr, hpoSaveRes) {
						// Handle Hpo save error
						if (hpoSaveErr) done(hpoSaveErr);

						// Delete existing Hpo
						agent.delete('/hpos/' + hpoSaveRes.body._id)
							.send(hpo)
							.expect(200)
							.end(function(hpoDeleteErr, hpoDeleteRes) {
								// Handle Hpo error error
								if (hpoDeleteErr) done(hpoDeleteErr);

								// Set assertions
								(hpoDeleteRes.body._id).should.equal(hpoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Hpo instance if not signed in', function(done) {
		// Set Hpo user 
		hpo.user = user;

		// Create new Hpo model instance
		var hpoObj = new Hpo(hpo);

		// Save the Hpo
		hpoObj.save(function() {
			// Try deleting Hpo
			request(app).delete('/hpos/' + hpoObj._id)
			.expect(401)
			.end(function(hpoDeleteErr, hpoDeleteRes) {
				// Set message assertion
				(hpoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Hpo error error
				done(hpoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Hpo.remove().exec();
		done();
	});
});