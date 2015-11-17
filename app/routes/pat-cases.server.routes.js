'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var patCases = require('../../app/controllers/pat-cases.server.controller');

    // Pat cases Routes
    app.route('/pat-cases')
            .get(patCases.list)
            .post(patCases.request);
    
    app.route('/pat-case-id')
            .post(patCases.findId);

    app.route('/pat-cases-create')
            .get(patCases.list)
            .post(users.requiresLogin, patCases.create);
    
    app.route('/pat-cases-delete')
            .post(users.requiresLogin, patCases.delete);

    app.route('/pat-cases/:patCaseId')
            .get(patCases.read)
            .put(users.requiresLogin, patCases.hasAuthorization, patCases.update)
            .delete(users.requiresLogin, patCases.hasAuthorization, patCases.delete);

    // Finish by binding the Pat case middleware
    app.param('patCaseId', patCases.patCaseByID);
};
