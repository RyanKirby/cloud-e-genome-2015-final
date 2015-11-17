'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Omim = mongoose.model('Omim'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, omim;

/**
 * Omim routes tests
 */
describe('Omim CRUD tests', function() {
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

		// Save a user to the test db and create new Omim
		user.save(function() {
			omim = {
				name: 'Omim Name'
			};

			done();
		});
	});

	it('should be able to save Omim instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Omim
				agent.post('/omims')
					.send(omim)
					.expect(200)
					.end(function(omimSaveErr, omimSaveRes) {
						// Handle Omim save error
						if (omimSaveErr) done(omimSaveErr);

						// Get a list of Omims
						agent.get('/omims')
							.end(function(omimsGetErr, omimsGetRes) {
								// Handle Omim save error
								if (omimsGetErr) done(omimsGetErr);

								// Get Omims list
								var omims = omimsGetRes.body;

								// Set assertions
								(omims[0].user._id).should.equal(userId);
								(omims[0].name).should.match('Omim Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Omim instance if not logged in', function(done) {
		agent.post('/omims')
			.send(omim)
			.expect(401)
			.end(function(omimSaveErr, omimSaveRes) {
				// Call the assertion callback
				done(omimSaveErr);
			});
	});

	it('should not be able to save Omim instance if no name is provided', function(done) {
		// Invalidate name field
		omim.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Omim
				agent.post('/omims')
					.send(omim)
					.expect(400)
					.end(function(omimSaveErr, omimSaveRes) {
						// Set message assertion
						(omimSaveRes.body.message).should.match('Please fill Omim name');
						
						// Handle Omim save error
						done(omimSaveErr);
					});
			});
	});

	it('should be able to update Omim instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Omim
				agent.post('/omims')
					.send(omim)
					.expect(200)
					.end(function(omimSaveErr, omimSaveRes) {
						// Handle Omim save error
						if (omimSaveErr) done(omimSaveErr);

						// Update Omim name
						omim.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Omim
						agent.put('/omims/' + omimSaveRes.body._id)
							.send(omim)
							.expect(200)
							.end(function(omimUpdateErr, omimUpdateRes) {
								// Handle Omim update error
								if (omimUpdateErr) done(omimUpdateErr);

								// Set assertions
								(omimUpdateRes.body._id).should.equal(omimSaveRes.body._id);
								(omimUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Omims if not signed in', function(done) {
		// Create new Omim model instance
		var omimObj = new Omim(omim);

		// Save the Omim
		omimObj.save(function() {
			// Request Omims
			request(app).get('/omims')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Omim if not signed in', function(done) {
		// Create new Omim model instance
		var omimObj = new Omim(omim);

		// Save the Omim
		omimObj.save(function() {
			request(app).get('/omims/' + omimObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', omim.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Omim instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Omim
				agent.post('/omims')
					.send(omim)
					.expect(200)
					.end(function(omimSaveErr, omimSaveRes) {
						// Handle Omim save error
						if (omimSaveErr) done(omimSaveErr);

						// Delete existing Omim
						agent.delete('/omims/' + omimSaveRes.body._id)
							.send(omim)
							.expect(200)
							.end(function(omimDeleteErr, omimDeleteRes) {
								// Handle Omim error error
								if (omimDeleteErr) done(omimDeleteErr);

								// Set assertions
								(omimDeleteRes.body._id).should.equal(omimSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Omim instance if not signed in', function(done) {
		// Set Omim user 
		omim.user = user;

		// Create new Omim model instance
		var omimObj = new Omim(omim);

		// Save the Omim
		omimObj.save(function() {
			// Try deleting Omim
			request(app).delete('/omims/' + omimObj._id)
			.expect(401)
			.end(function(omimDeleteErr, omimDeleteRes) {
				// Set message assertion
				(omimDeleteRes.body.message).should.match('User is not logged in');

				// Handle Omim error error
				done(omimDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Omim.remove().exec();
		done();
	});
});