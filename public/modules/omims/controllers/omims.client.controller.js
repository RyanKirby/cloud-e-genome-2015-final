'use strict';

// Omims controller
angular.module('omims').controller('OmimsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Omims',
	function($scope, $stateParams, $location, Authentication, Omims) {
		$scope.authentication = Authentication;

		// Create new Omim
		$scope.create = function() {
			// Create new Omim object
			var omim = new Omims ({
				name: this.name
			});

			// Redirect after save
			omim.$save(function(response) {
				$location.path('omims/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Omim
		$scope.remove = function(omim) {
			if ( omim ) { 
				omim.$remove();

				for (var i in $scope.omims) {
					if ($scope.omims [i] === omim) {
						$scope.omims.splice(i, 1);
					}
				}
			} else {
				$scope.omim.$remove(function() {
					$location.path('omims');
				});
			}
		};

		// Update existing Omim
		$scope.update = function() {
			var omim = $scope.omim;

			omim.$update(function() {
				$location.path('omims/' + omim._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Omims
		$scope.find = function() {
			$scope.omims = Omims.query();
		};

		// Find existing Omim
		$scope.findOne = function() {
			$scope.omim = Omims.get({ 
				omimId: $stateParams.omimId
			});
		};
	}
]);