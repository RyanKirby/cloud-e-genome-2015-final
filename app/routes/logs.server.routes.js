'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var logs = require('../../app/controllers/logs.server.controller');

	// Logs Routes
	app.route('/logs')
		.get(logs.list)
		.post(users.requiresLogin, logs.create);
        
        app.route('/logs-user')
                .post(logs.userList);
        
        app.route('/logs-var-cross')
                .post(logs.variantCrossSearch);
        
        app.route('/logs-gene-cross')
                .post(logs.geneCrossSearch);
        
        app.route('/logs-patient')
                .post(logs.patientList);
       
        app.route('/logs-variants')
                .post(logs.variantList);
        
        app.route('/logs-case')
                .post(logs.caseList);
        
	app.route('/logs/:logId')
		.get(logs.read)
		.put(users.requiresLogin, logs.hasAuthorization, logs.update)
		.delete(users.requiresLogin, logs.hasAuthorization, logs.delete);

	// Finish by binding the Log middleware
	app.param('logId', logs.logByID);
};
