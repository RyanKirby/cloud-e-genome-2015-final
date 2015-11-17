'use strict';

//Clinvars service used to communicate Clinvars REST endpoints
angular.module('clinvars').factory('Clinvars', ['$resource',
	function($resource) {
		return $resource('clinvars/:clinvarId', { clinvarId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);