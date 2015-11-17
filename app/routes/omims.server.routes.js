'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var omims = require('../../app/controllers/omims.server.controller');

	// Omims Routes
	app.route('/omims')
		.post(omims.list);
        
        app.route('/omims/gene')
		.post(omims.listDisease);

	app.route('/omims/:omimId')
		.get(omims.read)
		.put(users.requiresLogin, omims.hasAuthorization);

	// Finish by binding the Omim middleware
	app.param('omimId', omims.omimByID);
};
