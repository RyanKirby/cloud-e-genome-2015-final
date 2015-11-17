'use strict';

// Investigations controller
angular.module('investigations').controller('InvestigationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Investigations',
	function($scope, $stateParams, $location, Authentication, Investigations) {
		$scope.authentication = Authentication;

		// Create new Investigation
		$scope.create = function() {
			// Create new Investigation object
			var investigation = new Investigations ({
				name: this.name
			});

			// Redirect after save
			investigation.$save(function(response) {
				$location.path('investigations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Investigation
		$scope.remove = function(investigation) {
			if ( investigation ) { 
				investigation.$remove();

				for (var i in $scope.investigations) {
					if ($scope.investigations [i] === investigation) {
						$scope.investigations.splice(i, 1);
					}
				}
			} else {
				$scope.investigation.$remove(function() {
					$location.path('investigations');
				});
			}
		};

		// Update existing Investigation
		$scope.update = function() {
			var investigation = $scope.investigation;

			investigation.$update(function() {
				$location.path('investigations/' + investigation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Investigations
		$scope.find = function() {
			$scope.investigations = Investigations.query();
		};

		// Find existing Investigation
		$scope.findOne = function() {
			$scope.investigation = Investigations.get({ 
				investigationId: $stateParams.investigationId
			});
		};
	}
]);