'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var patients = require('../../app/controllers/patients.server.controller');

	// Patients Routes
	app.route('/patients')
		.get(patients.list)
		.post(users.requiresLogin, patients.create);
        
        app.route('/patientid')
                .post(patients.patId);
        

	app.route('/patients/:patientId')
		.get(patients.read)
		.put(users.requiresLogin, patients.hasAuthorization, patients.update)
		.delete(users.requiresLogin, patients.hasAuthorization, patients.delete);

	// Finish by binding the Patient middleware
	app.param('patientId', patients.patientByID);
};
