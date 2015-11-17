'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var variants = require('../../app/controllers/variants.server.controller');

	// Variants Routes
	app.route('/variants')
		.post(variants.list);
        
        app.route('/variants/omims')
		.post(variants.listOmim);
        
        app.route('/getoverview')
		.post(variants.overview);
        
        app.route('/variant/id')
		.post(variants.variantId);

	app.route('/variants/:variantId')
		.get(variants.read)
		.put(users.requiresLogin, variants.hasAuthorization, variants.update)
		.delete(users.requiresLogin, variants.hasAuthorization, variants.delete);

	// Finish by binding the Variant middleware
	app.param('variantId', variants.variantByID);
};
