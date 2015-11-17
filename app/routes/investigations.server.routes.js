'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var investigations = require('../../app/controllers/investigations.server.controller');

    // Investigations Routes
    app.route('/investigations')
            .get(investigations.list)
            .post(users.requiresLogin, investigations.create);

    app.route('/investigations/find')
            .post(investigations.list);

    app.route('/investigations/find-by-var')
            .post(investigations.findInvsByVar);
    
        app.route('/investigations/find-by-gene')
            .post(investigations.findInvsByGene);



    app.route('/investigations/find-all')
            .post(investigations.findAll);

    app.route('/investigations/delete')
            .post(investigations.delete);

    app.route('/investigations/create')
            .post(investigations.create);

    app.route('/investigations/update')
            .post(investigations.updateInv);

    app.route('/investigations/:investigationId')
            .get(investigations.read)
            .put(users.requiresLogin, investigations.hasAuthorization, investigations.update)
            .delete(users.requiresLogin, investigations.hasAuthorization, investigations.delete);

    // Finish by binding the Investigation middleware
    app.param('investigationId', investigations.investigationByID);
};
