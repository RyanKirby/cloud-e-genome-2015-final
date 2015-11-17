'use strict';

//Setting up route
angular.module('investigations').config(['$stateProvider',
	function($stateProvider) {
		// Investigations state routing
		$stateProvider.
		state('listInvestigations', {
			url: '/investigations',
			templateUrl: 'modules/investigations/views/list-investigations.client.view.html'
		}).
		state('createInvestigation', {
			url: '/investigations/create',
			templateUrl: 'modules/investigations/views/create-investigation.client.view.html'
		}).
		state('viewInvestigation', {
			url: '/investigations/:investigationId',
			templateUrl: 'modules/investigations/views/view-investigation.client.view.html'
		}).
		state('editInvestigation', {
			url: '/investigations/:investigationId/edit',
			templateUrl: 'modules/investigations/views/edit-investigation.client.view.html'
		});
	}
]);