'use strict';

//Investigations service used to communicate Investigations REST endpoints
angular.module('investigations').factory('Investigations', ['$resource',
	function($resource) {
		return $resource('investigations/:investigationId', { investigationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);