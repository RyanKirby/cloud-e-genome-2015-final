'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var hpos = require('../../app/controllers/hpos.server.controller');

	// Hpos Routes
	app.route('/hpos')
		.post(hpos.list);

	app.route('/hpos/:hpoId')
		.get(hpos.read)
		.put(users.requiresLogin, hpos.hasAuthorization, hpos.update)
		.delete(users.requiresLogin, hpos.hasAuthorization, hpos.delete);

	// Finish by binding the Hpo middleware
	app.param('hpoId', hpos.hpoByID);
};
