'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Investigation = mongoose.model('Investigation'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, investigation;

/**
 * Investigation routes tests
 */
describe('Investigation CRUD tests', function() {
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

		// Save a user to the test db and create new Investigation
		user.save(function() {
			investigation = {
				name: 'Investigation Name'
			};

			done();
		});
	});

	it('should be able to save Investigation instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Investigation
				agent.post('/investigations')
					.send(investigation)
					.expect(200)
					.end(function(investigationSaveErr, investigationSaveRes) {
						// Handle Investigation save error
						if (investigationSaveErr) done(investigationSaveErr);

						// Get a list of Investigations
						agent.get('/investigations')
							.end(function(investigationsGetErr, investigationsGetRes) {
								// Handle Investigation save error
								if (investigationsGetErr) done(investigationsGetErr);

								// Get Investigations list
								var investigations = investigationsGetRes.body;

								// Set assertions
								(investigations[0].user._id).should.equal(userId);
								(investigations[0].name).should.match('Investigation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Investigation instance if not logged in', function(done) {
		agent.post('/investigations')
			.send(investigation)
			.expect(401)
			.end(function(investigationSaveErr, investigationSaveRes) {
				// Call the assertion callback
				done(investigationSaveErr);
			});
	});

	it('should not be able to save Investigation instance if no name is provided', function(done) {
		// Invalidate name field
		investigation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Investigation
				agent.post('/investigations')
					.send(investigation)
					.expect(400)
					.end(function(investigationSaveErr, investigationSaveRes) {
						// Set message assertion
						(investigationSaveRes.body.message).should.match('Please fill Investigation name');
						
						// Handle Investigation save error
						done(investigationSaveErr);
					});
			});
	});

	it('should be able to update Investigation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Investigation
				agent.post('/investigations')
					.send(investigation)
					.expect(200)
					.end(function(investigationSaveErr, investigationSaveRes) {
						// Handle Investigation save error
						if (investigationSaveErr) done(investigationSaveErr);

						// Update Investigation name
						investigation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Investigation
						agent.put('/investigations/' + investigationSaveRes.body._id)
							.send(investigation)
							.expect(200)
							.end(function(investigationUpdateErr, investigationUpdateRes) {
								// Handle Investigation update error
								if (investigationUpdateErr) done(investigationUpdateErr);

								// Set assertions
								(investigationUpdateRes.body._id).should.equal(investigationSaveRes.body._id);
								(investigationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Investigations if not signed in', function(done) {
		// Create new Investigation model instance
		var investigationObj = new Investigation(investigation);

		// Save the Investigation
		investigationObj.save(function() {
			// Request Investigations
			request(app).get('/investigations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Investigation if not signed in', function(done) {
		// Create new Investigation model instance
		var investigationObj = new Investigation(investigation);

		// Save the Investigation
		investigationObj.save(function() {
			request(app).get('/investigations/' + investigationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', investigation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Investigation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Investigation
				agent.post('/investigations')
					.send(investigation)
					.expect(200)
					.end(function(investigationSaveErr, investigationSaveRes) {
						// Handle Investigation save error
						if (investigationSaveErr) done(investigationSaveErr);

						// Delete existing Investigation
						agent.delete('/investigations/' + investigationSaveRes.body._id)
							.send(investigation)
							.expect(200)
							.end(function(investigationDeleteErr, investigationDeleteRes) {
								// Handle Investigation error error
								if (investigationDeleteErr) done(investigationDeleteErr);

								// Set assertions
								(investigationDeleteRes.body._id).should.equal(investigationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Investigation instance if not signed in', function(done) {
		// Set Investigation user 
		investigation.user = user;

		// Create new Investigation model instance
		var investigationObj = new Investigation(investigation);

		// Save the Investigation
		investigationObj.save(function() {
			// Try deleting Investigation
			request(app).delete('/investigations/' + investigationObj._id)
			.expect(401)
			.end(function(investigationDeleteErr, investigationDeleteRes) {
				// Set message assertion
				(investigationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Investigation error error
				done(investigationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Investigation.remove().exec();
		done();
	});
});