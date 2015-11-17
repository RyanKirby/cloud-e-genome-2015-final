'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('options', {
			url: '/options',
			templateUrl: 'modules/core/views/options.client.view.html'
		}).
		state('lower-section', {
			url: '/lower-section',
			templateUrl: 'modules/core/views/lower-section.client.view.html'
		}).
		state('panel', {
			url: '/panel',
			templateUrl: 'modules/core/views/panel.client.view.html'
		}).
		state('template', {
			url: '/template',
			templateUrl: 'modules/core/views/template.client.view.html'
		}).
		state('toolbox', {
			url: '/toolbox',
			templateUrl: 'modules/core/views/toolbox.client.view.html'
		}).
		state('main', {
			url: '/main',
			templateUrl: 'modules/core/views/main.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);