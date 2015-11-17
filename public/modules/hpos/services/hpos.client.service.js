'use strict';

//Hpos service used to communicate Hpos REST endpoints
angular.module('hpos').factory('Hpos', ['$resource',
	function($resource) {
		return $resource('hpos/:hpoId', { hpoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);