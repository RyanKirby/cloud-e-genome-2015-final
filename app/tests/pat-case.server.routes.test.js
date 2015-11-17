'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PatCase = mongoose.model('PatCase'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, patCase;

/**
 * Pat case routes tests
 */
describe('Pat case CRUD tests', function() {
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

		// Save a user to the test db and create new Pat case
		user.save(function() {
			patCase = {
				name: 'Pat case Name'
			};

			done();
		});
	});

	it('should be able to save Pat case instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pat case
				agent.post('/pat-cases')
					.send(patCase)
					.expect(200)
					.end(function(patCaseSaveErr, patCaseSaveRes) {
						// Handle Pat case save error
						if (patCaseSaveErr) done(patCaseSaveErr);

						// Get a list of Pat cases
						agent.get('/pat-cases')
							.end(function(patCasesGetErr, patCasesGetRes) {
								// Handle Pat case save error
								if (patCasesGetErr) done(patCasesGetErr);

								// Get Pat cases list
								var patCases = patCasesGetRes.body;

								// Set assertions
								(patCases[0].user._id).should.equal(userId);
								(patCases[0].name).should.match('Pat case Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pat case instance if not logged in', function(done) {
		agent.post('/pat-cases')
			.send(patCase)
			.expect(401)
			.end(function(patCaseSaveErr, patCaseSaveRes) {
				// Call the assertion callback
				done(patCaseSaveErr);
			});
	});

	it('should not be able to save Pat case instance if no name is provided', function(done) {
		// Invalidate name field
		patCase.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pat case
				agent.post('/pat-cases')
					.send(patCase)
					.expect(400)
					.end(function(patCaseSaveErr, patCaseSaveRes) {
						// Set message assertion
						(patCaseSaveRes.body.message).should.match('Please fill Pat case name');
						
						// Handle Pat case save error
						done(patCaseSaveErr);
					});
			});
	});

	it('should be able to update Pat case instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pat case
				agent.post('/pat-cases')
					.send(patCase)
					.expect(200)
					.end(function(patCaseSaveErr, patCaseSaveRes) {
						// Handle Pat case save error
						if (patCaseSaveErr) done(patCaseSaveErr);

						// Update Pat case name
						patCase.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pat case
						agent.put('/pat-cases/' + patCaseSaveRes.body._id)
							.send(patCase)
							.expect(200)
							.end(function(patCaseUpdateErr, patCaseUpdateRes) {
								// Handle Pat case update error
								if (patCaseUpdateErr) done(patCaseUpdateErr);

								// Set assertions
								(patCaseUpdateRes.body._id).should.equal(patCaseSaveRes.body._id);
								(patCaseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pat cases if not signed in', function(done) {
		// Create new Pat case model instance
		var patCaseObj = new PatCase(patCase);

		// Save the Pat case
		patCaseObj.save(function() {
			// Request Pat cases
			request(app).get('/pat-cases')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pat case if not signed in', function(done) {
		// Create new Pat case model instance
		var patCaseObj = new PatCase(patCase);

		// Save the Pat case
		patCaseObj.save(function() {
			request(app).get('/pat-cases/' + patCaseObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', patCase.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pat case instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pat case
				agent.post('/pat-cases')
					.send(patCase)
					.expect(200)
					.end(function(patCaseSaveErr, patCaseSaveRes) {
						// Handle Pat case save error
						if (patCaseSaveErr) done(patCaseSaveErr);

						// Delete existing Pat case
						agent.delete('/pat-cases/' + patCaseSaveRes.body._id)
							.send(patCase)
							.expect(200)
							.end(function(patCaseDeleteErr, patCaseDeleteRes) {
								// Handle Pat case error error
								if (patCaseDeleteErr) done(patCaseDeleteErr);

								// Set assertions
								(patCaseDeleteRes.body._id).should.equal(patCaseSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pat case instance if not signed in', function(done) {
		// Set Pat case user 
		patCase.user = user;

		// Create new Pat case model instance
		var patCaseObj = new PatCase(patCase);

		// Save the Pat case
		patCaseObj.save(function() {
			// Try deleting Pat case
			request(app).delete('/pat-cases/' + patCaseObj._id)
			.expect(401)
			.end(function(patCaseDeleteErr, patCaseDeleteRes) {
				// Set message assertion
				(patCaseDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pat case error error
				done(patCaseDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PatCase.remove().exec();
		done();
	});
});