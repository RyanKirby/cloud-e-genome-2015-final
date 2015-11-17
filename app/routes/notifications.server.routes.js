'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var notifications = require('../../app/controllers/notifications.server.controller');

	// Notifications Routes
	app.route('/notification')
		.get(notifications.list);
        
        app.route('/nts-create')
		.post(notifications.ntsCreate);

	app.route('/notifications/:notificationId')
		.get(notifications.read)
		.put(users.requiresLogin, notifications.hasAuthorization, notifications.update)
		.delete(users.requiresLogin, notifications.hasAuthorization, notifications.delete);

	// Finish by binding the Notification middleware
	app.param('notificationId', notifications.notificationByID);
};
