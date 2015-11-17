'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Variant = mongoose.model('Variant'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, variant;

/**
 * Variant routes tests
 */
describe('Variant CRUD tests', function() {
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

		// Save a user to the test db and create new Variant
		user.save(function() {
			variant = {
				name: 'Variant Name'
			};

			done();
		});
	});

	it('should be able to save Variant instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Variant
				agent.post('/variants')
					.send(variant)
					.expect(200)
					.end(function(variantSaveErr, variantSaveRes) {
						// Handle Variant save error
						if (variantSaveErr) done(variantSaveErr);

						// Get a list of Variants
						agent.get('/variants')
							.end(function(variantsGetErr, variantsGetRes) {
								// Handle Variant save error
								if (variantsGetErr) done(variantsGetErr);

								// Get Variants list
								var variants = variantsGetRes.body;

								// Set assertions
								(variants[0].user._id).should.equal(userId);
								(variants[0].name).should.match('Variant Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Variant instance if not logged in', function(done) {
		agent.post('/variants')
			.send(variant)
			.expect(401)
			.end(function(variantSaveErr, variantSaveRes) {
				// Call the assertion callback
				done(variantSaveErr);
			});
	});

	it('should not be able to save Variant instance if no name is provided', function(done) {
		// Invalidate name field
		variant.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Variant
				agent.post('/variants')
					.send(variant)
					.expect(400)
					.end(function(variantSaveErr, variantSaveRes) {
						// Set message assertion
						(variantSaveRes.body.message).should.match('Please fill Variant name');
						
						// Handle Variant save error
						done(variantSaveErr);
					});
			});
	});

	it('should be able to update Variant instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Variant
				agent.post('/variants')
					.send(variant)
					.expect(200)
					.end(function(variantSaveErr, variantSaveRes) {
						// Handle Variant save error
						if (variantSaveErr) done(variantSaveErr);

						// Update Variant name
						variant.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Variant
						agent.put('/variants/' + variantSaveRes.body._id)
							.send(variant)
							.expect(200)
							.end(function(variantUpdateErr, variantUpdateRes) {
								// Handle Variant update error
								if (variantUpdateErr) done(variantUpdateErr);

								// Set assertions
								(variantUpdateRes.body._id).should.equal(variantSaveRes.body._id);
								(variantUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Variants if not signed in', function(done) {
		// Create new Variant model instance
		var variantObj = new Variant(variant);

		// Save the Variant
		variantObj.save(function() {
			// Request Variants
			request(app).get('/variants')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Variant if not signed in', function(done) {
		// Create new Variant model instance
		var variantObj = new Variant(variant);

		// Save the Variant
		variantObj.save(function() {
			request(app).get('/variants/' + variantObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', variant.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Variant instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Variant
				agent.post('/variants')
					.send(variant)
					.expect(200)
					.end(function(variantSaveErr, variantSaveRes) {
						// Handle Variant save error
						if (variantSaveErr) done(variantSaveErr);

						// Delete existing Variant
						agent.delete('/variants/' + variantSaveRes.body._id)
							.send(variant)
							.expect(200)
							.end(function(variantDeleteErr, variantDeleteRes) {
								// Handle Variant error error
								if (variantDeleteErr) done(variantDeleteErr);

								// Set assertions
								(variantDeleteRes.body._id).should.equal(variantSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Variant instance if not signed in', function(done) {
		// Set Variant user 
		variant.user = user;

		// Create new Variant model instance
		var variantObj = new Variant(variant);

		// Save the Variant
		variantObj.save(function() {
			// Try deleting Variant
			request(app).delete('/variants/' + variantObj._id)
			.expect(401)
			.end(function(variantDeleteErr, variantDeleteRes) {
				// Set message assertion
				(variantDeleteRes.body.message).should.match('User is not logged in');

				// Handle Variant error error
				done(variantDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Variant.remove().exec();
		done();
	});
});