'use strict';

//Omims service used to communicate Omims REST endpoints
angular.module('omims').factory('Omims', ['$resource',
	function($resource) {
		return $resource('omims/:omimId', { omimId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);