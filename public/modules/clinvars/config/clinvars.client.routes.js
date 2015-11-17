'use strict';

//Setting up route
angular.module('clinvars').config(['$stateProvider',
	function($stateProvider) {
		// Clinvars state routing
		$stateProvider.
		state('listClinvars', {
			url: '/clinvars',
			templateUrl: 'modules/clinvars/views/list-clinvars.client.view.html'
		}).
		state('createClinvar', {
			url: '/clinvars/create',
			templateUrl: 'modules/clinvars/views/create-clinvar.client.view.html'
		}).
		state('viewClinvar', {
			url: '/clinvars/:clinvarId',
			templateUrl: 'modules/clinvars/views/view-clinvar.client.view.html'
		}).
		state('editClinvar', {
			url: '/clinvars/:clinvarId/edit',
			templateUrl: 'modules/clinvars/views/edit-clinvar.client.view.html'
		});
	}
]);