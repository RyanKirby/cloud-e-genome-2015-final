'use strict';

// Hpos controller
angular.module('hpos').controller('HposController', ['$scope', '$stateParams', '$location', 'Authentication', 'Hpos', '$http',
    function ($scope, $stateParams, $location, Authentication, Hpos, $http) {
        $scope.authentication = Authentication;

        // Create new Hpo
        $scope.create = function () {
            // Create new Hpo object
            var hpo = new Hpos({
                name: this.name
            });

            // Redirect after save
            hpo.$save(function (response) {
                $location.path('hpos/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Hpo
        $scope.remove = function (hpo) {
            if (hpo) {
                hpo.$remove();

                for (var i in $scope.hpos) {
                    if ($scope.hpos [i] === hpo) {
                        $scope.hpos.splice(i, 1);
                    }
                }
            } else {
                $scope.hpo.$remove(function () {
                    $location.path('hpos');
                });
            }
        };

        // Update existing Hpo
        $scope.update = function () {
            var hpo = $scope.hpo;

            hpo.$update(function () {
                $location.path('hpos/' + hpo._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Hpos
        $scope.find = function () {

            $http.post('/hpos', {}).success(function (response) {


                $scope.hpos = response;
                return $scope.hpos;


            });
        };

        // Find existing Hpo
        $scope.findOne = function () {
            $scope.hpo = Hpos.get({
                hpoId: $stateParams.hpoId
            });
        };
    }
]);