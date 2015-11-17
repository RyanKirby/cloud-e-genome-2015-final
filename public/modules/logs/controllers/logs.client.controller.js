'use strict';

// Logs controller
angular.module('logs').controller('LogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Logs', '$sce', '$http',
    function ($scope, $stateParams, $location, Authentication, Logs, $sce, $http) {



        $scope.searchLog = [];


        $scope.findAllInv = function (vrt) {


            $http.post('/investigations/find-by-var', {gene: vrt.Gene_knownGene, start: vrt.Start})
                    .success(function (res) {
                        $scope.investigations = res;
                        return $scope.investigations;
                    });


        };
        
         $scope.findInvGene = function (vrt) {


            $http.post('/investigations/find-by-gene', {gene: vrt.Gene_knownGene})
                    .success(function (res) {
                        $scope.investigations = res;
                        return $scope.investigations;
                    });


        };


        $scope.selectInv = function (inv) {
            $scope.investigation = inv;

            $scope.searchLog.push({
                name: inv.inv_name,
                info: inv.info.phenotype,
                type: 'investigation',
                data: inv
            });

            $scope.data = inv;

            $scope.search = 'inv';
        };


        $scope.findCase = function (pat_case) {

            $http.post('/pat-case-id', {id: pat_case})
                    .success(function (res) {

                        $scope.patCase = res;
                        $scope.data = res;
                        return $scope.patCase;
                    });

            $scope.search = 'case';



        };

        $scope.updateData = function (data) {
            $scope.data = data;
        };


        $scope.selectPatCase = function (patCase) {

            $scope.searchLog.push({
                name: patCase[0].case_name,
                info: patCase[0].user.displayName,
                type: 'case',
                data: patCase[0]
            });

            $scope.data = patCase;

            $scope.search = 'case-search';

        };



        $scope.selectVrt = function (vrt) {
            $scope.variant = vrt;

            $scope.searchLog.push({
                name: vrt.Gene_knownGene,
                info: vrt.Start,
                type: 'variant',
                data: vrt
            });

            $scope.data = vrt;

            $scope.search = 'vrt';

        };





        $scope.findVar = function (id) {
            $scope.search = 'varResults';
            $scope.variants = id;

        };





        $scope.getInvs = function () {
            $http.post("/investigations/find-all", {})
                    .success(function (res) {
                        $scope.investigations = res;
                        return $scope.investigations;
                    });

        };






        $scope.variantCrossSearch = function (id) {
            $http.post('/logs-var-cross', {id: id})
                    .success(function (res) {
                        $scope.logsRes = res;
                        return $scope.logs;
                    });
        };

        $scope.geneCrossSearch = function (gene) {
            $http.post('/logs-gene-cross', {gene: gene})
                    .success(function (res) {
                        $scope.logsRes = res;
                        return $scope.logs;
                    });
        };


        $scope.searchLogs = false;

        $scope.searchLogFunc = function (x) {
            $scope.searchLogs = x;
        };



        $scope.setLog = function (log) {

            $scope.searchLogs = false;

            if (log === 'clear') {
                $scope.log = '';
                $scope.provjSvgData = '';
                $scope.provjProvData = '';
            } else {
                $scope.log = log;
            }
        };





        var x;

        var api = new $.provStoreApi({username: 'RyanKirby', key: '258ed9fab10253ad9513c1ea0741bc4c11acc3b3'});


        var data;


        var genDataCase = function (log) {
            data = {
                'prefix': {
                    'xsd': 'http://www.w3.org/2001/XMLSchema',
                    'foaf': 'http://xmlns.com/foaf/0.1/',
                    'prov': 'http://www.w3.org/ns/prov#',
                    'ex': 'http://example/',
                    'dcterms': 'http://purl.org/dc/terms/'
                },
                'entity': {
                    'ex:Case': {
                        'dcterms:title': 'A selected or created Case',
                        'dcterms:details': log.action.info,
                        'dcterms:patient': log.patient_id,
                        'dcterms:_id': log._id
                    },
                    'ex:Patients': {
                        'dcterms:title': 'List of all Patients'
                    }
                },
                'activity': {
                    'ex:Case_Created': {}

                },
                'wasGeneratedBy': {
                    '_:wGB52228': {
                        'prov:activity': 'ex:Case_Created',
                        'prov:entity': 'ex:Case'
                    }
                },
                'used': {
                    '_:u75129': {
                        'prov:activity': 'ex:Case_Created',
                        'prov:entity': 'ex:Patients'
                    }
                },
                'agent': {
                    'ex:User': {
                        'prov:type': {
                            '$': 'prov:Person',
                            'type': 'xsd:QName'
                        },
                        'foaf:givenName': {
                            '$': log.user.firstName + ' ' + log.user.lastName,
                            'type': 'xsd:string'
                        },
                        'foaf:mbox': {
                            '$': '\u003cmailto:abc@example.org\u003e',
                            'type': 'xsd:string'
                        }
                    }
                },
                'actedOnBehalfOf': {
                    '_:aOBO2471': {
                        'prov:delegate': 'ex:User',
                        'prov:responsible': 'ex:Case_Created'
                    }
                }

            };


        };

        var genDataInv = function (log) {
            data = {
                'prefix': {
                    'xsd': 'http://www.w3.org/2001/XMLSchema',
                    'foaf': 'http://xmlns.com/foaf/0.1/',
                    'prov': 'http://www.w3.org/ns/prov#',
                    'ex': 'http://example/',
                    'dcterms': 'http://purl.org/dc/terms/'
                },
                'entity': {
                    'ex:Case': {
                        'dcterms:title': 'A selected or created Case',
                        'dcterms:details': log.action.info,
                        'dcterms:_id': log._id
                    },
                    'ex:Investigation': {
                        'dcterms:title': '',
                        'dcterms:details': '',
                        'dcterms:patient': '',
                        'dcterms:_id': ''
                    },
                    'ex:Patients': {
                        'dcterms:title': 'List of all Patients'
                    }
                },
                'activity': {
                    'ex:Case_Created': {},
                    'ex:Investigation_Created': {}

                },
                'wasGeneratedBy': {
                    '_:wGB52228': {
                        'prov:activity': 'ex:Case_Created',
                        'prov:entity': 'ex:Case'
                    },
                    '_:wGB52229': {
                        'prov:activity': 'ex:Investigation_Created',
                        'prov:entity': 'ex:Investigation'
                    }
                },
                'used': {
                    '_:u75129': {
                        'prov:activity': 'ex:Case_Created',
                        'prov:entity': 'ex:Patients'
                    },
                    '_:u75130': {
                        'prov:activity': 'ex:Investigation_Created',
                        'prov:entity': 'ex:Case'
                    }
                },
                'agent': {
                    'ex:User': {
                        'prov:type': {
                            '$': 'prov:Person',
                            'type': 'xsd:QName'
                        },
                        'foaf:givenName': {
                            '$': log.user.firstName + ' ' + log.user.lastName,
                            'type': 'xsd:string'
                        },
                        'foaf:mbox': {
                            '$': '\u003cmailto:abc@example.org\u003e',
                            'type': 'xsd:string'
                        }
                    },
                    'ex:User1': {
                        'prov:type': {
                            '$': 'prov:Person',
                            'type': 'xsd:QName'
                        },
                        'foaf:givenName': {
                            '$': 'Ryan Kirby',
                            'type': 'xsd:string'
                        },
                        'foaf:mbox': {
                            '$': '\u003cmailto:abc@example.org\u003e',
                            'type': 'xsd:string'
                        }
                    }
                },
                'wasAssociatedWith': {
                    '_:aOBO2471': {
                        'prov:activity': 'ex:Investigation_Created',
                        'prov:agent': 'ex:User'
                    },
                    '_:aOBO2472': {
                        'prov:activity': 'ex:Case_Created',
                        'prov:agent': 'ex:User1'
                    }

                }

            };


        };

        var genDataVar = function (log) {


            data = {
                'prefix': {
                    'xsd': 'http://www.w3.org/2001/XMLSchema',
                    'foaf': 'http://xmlns.com/foaf/0.1/',
                    'prov': 'http://www.w3.org/ns/prov#',
                    'ex': 'http://example/',
                    'dcterms': 'http://purl.org/dc/terms/'
                },
                'entity': {
                    'ex:Case': {
                        'dcterms:title': log.action.patCase.name,
                        'dcterms:id': log.action.patCase.id
                    },
                    'ex:Investigation': {
                        'dcterms:id': log.action.investigation.id,
                        'dcterms:title': log.action.investigation.title,
                        'dcterms:phenotypes': log.action.investigation.phenotypes,
                        'dcterms:omim_intersected': log.action.investigation.omim_var.length,
                        'dcterms:clinvar': log.action.investigation.clinvar,
                        'dcterms:created_on': log.action.investigation.created
                    },
                    'ex:Variant': {
                        'dcterms:id': log.action.variant._id,
                        'dcterms:Gene': log.action.variant.gene,
                        'dcterms:Start': log.action.variant.pos,
                        'dcterms:Exonic_Func': log.action.variant.func,
                        'dcterms:MAF': log.action.variant.maf
                    },
                    'ex:Patients': {
                        'dcterms:title': log.patient_id
                    }
                },
                'activity': {
                    'ex:Case_Created': {},
                    'ex:Variant_Investigated': {},
                    'ex:Investigation_Created': {}

                },
                'wasGeneratedBy': {
                    '_:wGB52228': {
                        'prov:activity': 'ex:Case_Created',
                        'prov:entity': 'ex:Case'
                    }, '_:wGB52230': {
                        'prov:activity': 'ex:Variant_Investigated',
                        'prov:entity': 'ex:Variant'
                    },
                    '_:wGB52229': {
                        'prov:activity': 'ex:Investigation_Created',
                        'prov:entity': 'ex:Investigation'
                    }
                },
                'used': {
                    '_:u75129': {
                        'prov:activity': 'ex:Case_Created',
                        'prov:entity': 'ex:Patients'
                    },
                    '_:u75131': {
                        'prov:activity': 'ex:Variant_Investigated',
                        'prov:entity': 'ex:Investigation'
                    },
                    '_:u75130': {
                        'prov:activity': 'ex:Investigation_Created',
                        'prov:entity': 'ex:Case'
                    }
                },
                'agent': {
                    'ex:User': {
                        'prov:type': {
                            '$': 'prov:Person',
                            'type': 'xsd:QName'
                        },
                        'foaf:givenName': {
                            '$': log.user.firstName + ' ' + log.user.lastName,
                            'type': 'xsd:string'
                        },
                        'foaf:mbox': {
                            '$': '\u003cmailto:abc@example.org\u003e',
                            'type': 'xsd:string'
                        }
                    },
                    'ex:User1': {
                        'prov:type': {
                            '$': 'prov:Person',
                            'type': 'xsd:QName'
                        },
                        'foaf:givenName': {
                            '$': 'Alastair Hughes',
                            'type': 'xsd:string'
                        },
                        'foaf:mbox': {
                            '$': '\u003cmailto:abc@example.org\u003e',
                            'type': 'xsd:string'
                        }
                    }
                },
                'wasAssociatedWith': {
                    '_:aOBO2471': {
                        'prov:activity': 'ex:Investigation_Created',
                        'prov:agent': 'ex:User1'
                    },
                    '_:aOBO2473': {
                        'prov:activity': 'ex:Variant_Investigated',
                        'prov:agent': 'ex:User'
                    },
                    '_:aOBO2472': {
                        'prov:activity': 'ex:Case_Created',
                        'prov:agent': 'ex:User1'
                    }

                }

            };

            console.log(data);


        };

        $scope.provSvg = function (log, n) {
            console.log(n);

            if (n === 0) {
                genDataCase(log);
            } else if (n === 1) {
                genDataInv(log);
            } else {
                genDataVar(log);
            }
            api.submitDocument('primer-test', data, true,
                    function (new_document_id) {
                        console.log(new_document_id);
                        return api.getDocumentBody(new_document_id, 'svg',
                                function (response) {
                                    x = response;
                                    x = new XMLSerializer().serializeToString(x);

                                    return x;
                                },
                                function (error) {
                                    console.log(error);
                                }
                        );
                    },
                    function (error) {
                        console.error(error);
                    }
            );
        };

        $scope.provN = function (log, n) {

            if (n === 0) {
                genDataCase(log);
            } else if (n === 1) {
                genDataInv(log);
            } else {
                genDataVar(log);
            }

            api.submitDocument('primer-test', data, true,
                    function (new_document_id) {
                        console.log(new_document_id);
                        return api.getDocumentBody(new_document_id, 'provn',
                                function (response) {
                                    x = response;

                                    return x;
                                },
                                function (error) {
                                    console.log(error);
                                }
                        );
                    },
                    function (error) {
                        console.error(error);
                    }
            );

        };

        $scope.update1 = function () {
            $scope.provjSvgData = $sce.trustAsHtml(x);
        };

        $scope.update2 = function () {
            $scope.provjProvData = x;
        };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//        $scope.authentication = Authentication;
//
//        /**
//         * Removes an existing log, by taking a log id as a parameter
//         */
//        $scope.removeLog = function (log) {
//
//            if (log) {
//                log.$remove();
//                for (var i in $scope.logs) {
//                    if ($scope.logs [i] === log) {
//                        $scope.logs.splice(i, 1);
//                    }
//                }
//            } else {
//                $scope.log.$remove(function () {
//                    $scope.logs = Logs.query();
//                });
//            }
//        };
//
//        $scope.find = function () {
//            $scope.logs = Logs.query();
//        };
//
//        // Find existing Patient
//        $scope.findOne = function () {
//            $scope.log = Logs.get({
//                logId: $stateParams.logId
//            });
//        };
//
//
//        /**
//         * Updates an exisiting log, by taking a log id as a parameter
//         */
//        $scope.update = function () {
//            var log = $scope.log;
//
//            log.$update(function () {
//                $location.path('logs/' + log._id);
//            }, function (errorResponse) {
//                $scope.error = errorResponse.data.message;
//            });
//        };
//
//        /**
//         * Returns a list of all the logs in mongodb
//         */
//        $scope.findLogs = function () {
//            $scope.logs = Logs.query();
//        };
//

    }
]);