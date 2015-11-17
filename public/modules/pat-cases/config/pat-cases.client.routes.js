'use strict';

//Setting up route
angular.module('pat-cases').config(['$stateProvider',
    function ($stateProvider) {
        // Pat cases state routing
        $stateProvider.
                state('listPatCases', {
                    url: '/pat-cases',
                    templateUrl: 'modules/pat-cases/views/list-pat-cases.client.view.html'
                }).
                state('createPatCase', {
                    url: '/pat-cases/create',
                    templateUrl: 'modules/pat-cases/views/create-pat-case.client.view.html'
                }).
                state('viewPatCase', {
                    url: '/pat-cases/:patCaseId',
                    templateUrl: 'modules/pat-cases/views/view-pat-case.client.view.html'
                }).
                state('casesMain', {
                    url: '/cases-main',
                    templateUrl: 'modules/pat-cases/views/template.client.view.html'
                });
        ;
    }
]);