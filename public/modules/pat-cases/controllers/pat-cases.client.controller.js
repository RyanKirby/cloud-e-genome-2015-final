'use strict';

// Pat cases controller
angular.module('pat-cases').controller('PatCasesController', ['$scope', '$stateParams', '$location', 'Authentication', 'PatCases',
    function ($scope, $stateParams, $location, Authentication, PatCases) {
        $scope.authentication = Authentication;

        // Create new Pat case
        $scope.create = function () {
            // Create new Pat case object
            var patCase = new PatCases({
                name: this.name
            });

            // Redirect after save
            patCase.$save(function (response) {
                $location.path('pat-cases/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Pat case
        $scope.remove = function (patCase) {
            if (patCase) {
                patCase.$remove();

                for (var i in $scope.patCases) {
                    if ($scope.patCases [i] === patCase) {
                        $scope.patCases.splice(i, 1);
                    }
                }
            } else {
                $scope.patCase.$remove(function () {
                    $location.path('pat-cases');
                });
            }
        };

        // Update existing Pat case
        $scope.update = function () {
            var patCase = $scope.patCase;

            patCase.$update(function () {
                $location.path('pat-cases/' + patCase._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Pat cases
        $scope.find = function () {
            $scope.patCases = PatCases.query();
        };

        // Find existing Pat case
        $scope.findOne = function () {
            $scope.patCase = PatCases.get({
                patCaseId: $stateParams.patCaseId
            });
        };
    }
]);