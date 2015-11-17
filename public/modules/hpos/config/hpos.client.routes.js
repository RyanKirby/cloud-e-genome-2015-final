'use strict';

//Setting up route
angular.module('hpos').config(['$stateProvider',
	function($stateProvider) {
		// Hpos state routing
		$stateProvider.
		state('listHpos', {
			url: '/hpos',
			templateUrl: 'modules/hpos/views/list-hpos.client.view.html'
		}).
		state('createHpo', {
			url: '/hpos/create',
			templateUrl: 'modules/hpos/views/create-hpo.client.view.html'
		}).
		state('viewHpo', {
			url: '/hpos/:hpoId',
			templateUrl: 'modules/hpos/views/view-hpo.client.view.html'
		}).
		state('editHpo', {
			url: '/hpos/:hpoId/edit',
			templateUrl: 'modules/hpos/views/edit-hpo.client.view.html'
		});
	}
]);