'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Clinvar = mongoose.model('Clinvar'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, clinvar;

/**
 * Clinvar routes tests
 */
describe('Clinvar CRUD tests', function() {
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

		// Save a user to the test db and create new Clinvar
		user.save(function() {
			clinvar = {
				name: 'Clinvar Name'
			};

			done();
		});
	});

	it('should be able to save Clinvar instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clinvar
				agent.post('/clinvars')
					.send(clinvar)
					.expect(200)
					.end(function(clinvarSaveErr, clinvarSaveRes) {
						// Handle Clinvar save error
						if (clinvarSaveErr) done(clinvarSaveErr);

						// Get a list of Clinvars
						agent.get('/clinvars')
							.end(function(clinvarsGetErr, clinvarsGetRes) {
								// Handle Clinvar save error
								if (clinvarsGetErr) done(clinvarsGetErr);

								// Get Clinvars list
								var clinvars = clinvarsGetRes.body;

								// Set assertions
								(clinvars[0].user._id).should.equal(userId);
								(clinvars[0].name).should.match('Clinvar Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Clinvar instance if not logged in', function(done) {
		agent.post('/clinvars')
			.send(clinvar)
			.expect(401)
			.end(function(clinvarSaveErr, clinvarSaveRes) {
				// Call the assertion callback
				done(clinvarSaveErr);
			});
	});

	it('should not be able to save Clinvar instance if no name is provided', function(done) {
		// Invalidate name field
		clinvar.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clinvar
				agent.post('/clinvars')
					.send(clinvar)
					.expect(400)
					.end(function(clinvarSaveErr, clinvarSaveRes) {
						// Set message assertion
						(clinvarSaveRes.body.message).should.match('Please fill Clinvar name');
						
						// Handle Clinvar save error
						done(clinvarSaveErr);
					});
			});
	});

	it('should be able to update Clinvar instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clinvar
				agent.post('/clinvars')
					.send(clinvar)
					.expect(200)
					.end(function(clinvarSaveErr, clinvarSaveRes) {
						// Handle Clinvar save error
						if (clinvarSaveErr) done(clinvarSaveErr);

						// Update Clinvar name
						clinvar.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Clinvar
						agent.put('/clinvars/' + clinvarSaveRes.body._id)
							.send(clinvar)
							.expect(200)
							.end(function(clinvarUpdateErr, clinvarUpdateRes) {
								// Handle Clinvar update error
								if (clinvarUpdateErr) done(clinvarUpdateErr);

								// Set assertions
								(clinvarUpdateRes.body._id).should.equal(clinvarSaveRes.body._id);
								(clinvarUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Clinvars if not signed in', function(done) {
		// Create new Clinvar model instance
		var clinvarObj = new Clinvar(clinvar);

		// Save the Clinvar
		clinvarObj.save(function() {
			// Request Clinvars
			request(app).get('/clinvars')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Clinvar if not signed in', function(done) {
		// Create new Clinvar model instance
		var clinvarObj = new Clinvar(clinvar);

		// Save the Clinvar
		clinvarObj.save(function() {
			request(app).get('/clinvars/' + clinvarObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', clinvar.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Clinvar instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clinvar
				agent.post('/clinvars')
					.send(clinvar)
					.expect(200)
					.end(function(clinvarSaveErr, clinvarSaveRes) {
						// Handle Clinvar save error
						if (clinvarSaveErr) done(clinvarSaveErr);

						// Delete existing Clinvar
						agent.delete('/clinvars/' + clinvarSaveRes.body._id)
							.send(clinvar)
							.expect(200)
							.end(function(clinvarDeleteErr, clinvarDeleteRes) {
								// Handle Clinvar error error
								if (clinvarDeleteErr) done(clinvarDeleteErr);

								// Set assertions
								(clinvarDeleteRes.body._id).should.equal(clinvarSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Clinvar instance if not signed in', function(done) {
		// Set Clinvar user 
		clinvar.user = user;

		// Create new Clinvar model instance
		var clinvarObj = new Clinvar(clinvar);

		// Save the Clinvar
		clinvarObj.save(function() {
			// Try deleting Clinvar
			request(app).delete('/clinvars/' + clinvarObj._id)
			.expect(401)
			.end(function(clinvarDeleteErr, clinvarDeleteRes) {
				// Set message assertion
				(clinvarDeleteRes.body.message).should.match('User is not logged in');

				// Handle Clinvar error error
				done(clinvarDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Clinvar.remove().exec();
		done();
	});
});