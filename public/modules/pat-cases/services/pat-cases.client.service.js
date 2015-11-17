'use strict';

//Pat cases service used to communicate Pat cases REST endpoints
angular.module('pat-cases').factory('PatCases', ['$resource',
	function($resource) {
		return $resource('pat-cases/:patCaseId', { patCaseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);