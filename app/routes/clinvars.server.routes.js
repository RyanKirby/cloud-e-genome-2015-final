'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var clinvars = require('../../app/controllers/clinvars.server.controller');

	// Clinvars Routes
	app.route('/clinvars')
		.post(clinvars.list);
        
        // Clinvars Routes
	app.route('/clinvar')
		.post(clinvars.listOne);

	app.route('/clinvars/:clinvarId')
		.get(clinvars.read)
		.put(users.requiresLogin, clinvars.hasAuthorization, clinvars.update)
		.delete(users.requiresLogin, clinvars.hasAuthorization, clinvars.delete);

	// Finish by binding the Clinvar middleware
	app.param('clinvarId', clinvars.clinvarByID);
};
