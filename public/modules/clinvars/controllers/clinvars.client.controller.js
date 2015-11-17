'use strict';

// Clinvars controller
angular.module('clinvars').controller('ClinvarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clinvars',
	function($scope, $stateParams, $location, Authentication, Clinvars) {
		$scope.authentication = Authentication;

		// Create new Clinvar
		$scope.create = function() {
			// Create new Clinvar object
			var clinvar = new Clinvars ({
				name: this.name
			});

			// Redirect after save
			clinvar.$save(function(response) {
				$location.path('clinvars/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Clinvar
		$scope.remove = function(clinvar) {
			if ( clinvar ) { 
				clinvar.$remove();

				for (var i in $scope.clinvars) {
					if ($scope.clinvars [i] === clinvar) {
						$scope.clinvars.splice(i, 1);
					}
				}
			} else {
				$scope.clinvar.$remove(function() {
					$location.path('clinvars');
				});
			}
		};

		// Update existing Clinvar
		$scope.update = function() {
			var clinvar = $scope.clinvar;

			clinvar.$update(function() {
				$location.path('clinvars/' + clinvar._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Clinvars
		$scope.find = function() {
			$scope.clinvars = Clinvars.query();
		};

		// Find existing Clinvar
		$scope.findOne = function() {
			$scope.clinvar = Clinvars.get({ 
				clinvarId: $stateParams.clinvarId
			});
		};
	}
]);