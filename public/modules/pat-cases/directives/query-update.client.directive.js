'use strict';

angular.module('pat-cases').directive('queryUpdate', ['$http',
    function ($http) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {


                var first = true;
                var first1 = true;
                var first2 = true;
                var first3 = true;
                var apiId = '';
                var clinvar = [0, 0, 0];


                scope.$watch('omimApi', function () {

                    if (first2) {
                        first2 = false;
                    } else {
                        if (apiId !== scope.omimApi[0]) { //checks to see if omim api id has changed

                            apiId = scope.omimApi[0]; //updates current omim id to new one
                            scope.api = 'empty'; // sets scope to empty for loading symbol
                            //OMIM API request, search with OMIM id
                            $http.jsonp('http://api.europe.omim.org/api/entry?callback=JSON_CALLBACK&mimNumber=' + apiId + '&include=all&format=jsonp&apiKey=588FD689DFCE3E443B6325513ABC5EE9F6DAC27A').
                                    success(function (response) {
                                        scope.api = response.omim.entryList[0].entry;//updated tge scope with OMIM response
                                        console.log(scope.api);
                                        return scope.api;
                                    });
                        }
                    }
                });


                scope.$watch('phenotypes', function () {

                    if (first) {
                        first = false;
                    } else {

                        scope.searching = true;
                        scope.overview = '';

                        $http.post('/getoverview', {pheno: scope.phenotypes[scope.phenotypes.length - 1],
                            patId: scope.currentCase.patient_id.pat_id}).
                                success(function (data) {
                                    scope.overview = data;
                                    scope.searching = false;
                                    return scope.overview && scope.searching;
                                });

                        $http.post('/variants/omims', {pheno: scope.phenotypes,
                            patId: scope.currentCase.patient_id.pat_id}).
                                success(function (data) {
                                    scope.variants = data;
                                    scope.rowCollection = data;
                                    scope.displayedCollection = [].concat(data);

                                    return scope.variants;
                                    return  scope.displayedCollection;
                                });

                        if (scope.phenotypes[0]) {
                            $http.post('/hpos', {search: scope.phenotypes[0]})
                                    .success(function (data) {
                                        scope.hpos = data;
                                        scope.$apply(function () {
                                            scope.hpos = data;
                                        });
                                        return scope.hpos;
                                    });
                        }
                    }
                }, true);

                scope.$watch('inv_phenotype', function () {
                    if (first1) {
                        first1 = true;
                    } else {

                        if (scope.inv_runphenotype.length > 3) {

                            $http.post('/hpos', {search: scope.inv_phenotype})
                                    .success(function (data) {
                                        scope.hpos = data;
                                        return scope.hpos;
                                    });
                        }
                    }
                }, true);
            }
        };
    }
]);