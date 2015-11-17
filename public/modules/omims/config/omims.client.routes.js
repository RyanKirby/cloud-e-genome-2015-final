'use strict';

//Setting up route
angular.module('omims').config(['$stateProvider',
	function($stateProvider) {
		// Omims state routing
		$stateProvider.
		state('listOmims', {
			url: '/omims',
			templateUrl: 'modules/omims/views/list-omims.client.view.html'
		}).
		state('createOmim', {
			url: '/omims/create',
			templateUrl: 'modules/omims/views/create-omim.client.view.html'
		}).
		state('viewOmim', {
			url: '/omims/:omimId',
			templateUrl: 'modules/omims/views/view-omim.client.view.html'
		}).
		state('editOmim', {
			url: '/omims/:omimId/edit',
			templateUrl: 'modules/omims/views/edit-omim.client.view.html'
		});
	}
]);