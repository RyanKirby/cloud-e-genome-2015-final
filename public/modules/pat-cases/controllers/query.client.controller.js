'use strict';

angular.module('pat-cases').controller('QueryController', ['Authentication', '$scope', 'PatCases', 'Logs', '$http', '$sce',
    function (Authentication, $scope, PatCases, Logs, $http, $sce) {

///////////////////////logs

        $scope.logVar = function (lg) {
            $scope.searchLogs = false;

            $scope.log = lg;
        };

        $scope.searchLogs = false;

        $scope.searchLogFunc = function (x) {
            $scope.searchLogs = x;
        };

        var x;

        var api = new $.provStoreApi({username: 'RyanKirby', key: '258ed9fab10253ad9513c1ea0741bc4c11acc3b3'});

        var data;

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





        $scope.update1 = function () {
            $scope.provjSvgData = $sce.trustAsHtml(x);
        };









////////////////////
        $scope.varNot = function (varId, invId, caseId) {

            var user = Authentication;
            var tl = 'Variant was investigated';
            var details = {
                variant_id: varId,
                investigation_id: invId,
                case_id: caseId
            };

            console.log(tl);
            console.log(details);

            $http.post('/nts-create', {user: user, title: tl, details: details}).
                    success(function (res) {
                        //return console.log(res);
                    });



        };


        $scope.variantCrossSearch = function (g, p) {

            $http.post('/logs-var-cross', {gene: g, pos: p})
                    .success(function (res) {
                        console.log(res);
                        $scope.logsRes = res;
                        return $scope.logsRes;
                    });
        };



        $scope.geneCrossSearch = function (gene) {
            $http.post('/logs-gene-cross', {gene: gene})
                    .success(function (res) {
                        $scope.logsRes = res;
                        return $scope.logsRes;
                    });
        };





        /////////Patient Cases Queries////////////////

        var currentPat; //Variable for current patient selected by the user

        /**
         * Function to list all cases 
         * 
         * @returns {scope}
         */
        $scope.listCases = function () {
            $scope.patCases = PatCases.query();
        };

        /**
         * Funciton to list all patients
         * 
         * @returns {scope}
         */
        $scope.listPatients = function () {
            $http.get('/patients').success(function (data) {
                $scope.pats = data;
                
                return $scope.pats;
            });
        };

        /**
         * Function that sets the patient details selected by the user
         * 
         * @param {Patient} pat
         */
        $scope.selCurrentPatient = function (pat) {
            currentPat = pat;
        };

        /**
         * Function to create a new patient case and is logged
         * 
         * @returns {scope}
         */
        $scope.createCase = function () {

            var patCase = new PatCases({
                case_name: this.name,
                patient_id: {pat_id: currentPat._id,
                    pat_name: currentPat.name},
                comment: [],
                inv_id: []
            });

            $http.post('/pat-cases-create', patCase).
                    success(function (data) {
                        return logFunc(data);
                    });

            var logFunc = function (response) {

                var log = new Logs({
                    patient_id: currentPat._id,
                    case_id: response._id,
                    action: {
                        collection: 'Patient-Case',
                        info: 'Patient-case created',
                        _id: response._id
                    }
                });

                $http.post('/logs', log);
                $scope.patCases = PatCases.query();
            };


        };

        /**
         * Deletes a case
         * 
         * @param {type} cCase
         * @returns {scope}
         */
        $scope.deleteCase = function (cCase) {
            if (cCase) {
                $http.post('/pat-cases-delete', {patCase: cCase}).
                        success(function (data) {
                            $scope.patCases = data;
                            return $scope.patCases;
                        });
            }
        };

        /////////Investigation Queries////////////////

        /**
         * creates a new investigation and log
         * 
         * @param {type} investigation
         * @returns {scope}
         */
        $scope.createInv = function (investigation, id, finish) {

            if (finish) { //checks to see if a new investigation is created
                $http.post('/investigations/create', {inv: investigation}).//takes the investigation and stores it in MongoDB
                        success(function (response) {
                            return logFunc();
                        });

                var logFunc = function () { //function to create and add a new Log for the newly created investigation.
                    var log = new Logs({
                        patient_id: '',
                        case_id: investigation.pat_case_id,
                        action: {
                            collection: 'Investigation',
                            info: 'Investigation created',
                            _id: investigation._id
                        }
                    });

                    $http.post('/logs', log).//takes the log and stores it into MongoDB
                            success(function () {
                            });
                };
            }

            $http.post('/investigations/find', {case: id}).//updates the case with the new investigation added
                    success(function (response) {
                        $scope.investigations = response;
                        return $scope.investigations;
                    });
        };


        /**
         * Delete investigation by id
         * 
         * @param {type} cCase
         * @returns {scope}
         */
        $scope.deleteInv = function (id, case_id) {
            if (id) {
                $http.post('/investigations/delete', {id: id,
                    case_id: case_id}).
                        success(function (data) {
                            $scope.investigations = data;
                            return $scope.investigations;
                        });
            }
        };


        /**
         * Function that takes and investigation and updated the varaints intersected in omim
         * 
         * @param {Investigation} investigation
         * @param {Variant} omims
         * @returns {Investigation}
         */
        $scope.updateInv = function (investigation, omims) {

            $http.post('/investigations/update', {inv: investigation, omim: omims}).
                    success(function (response) {
                    });

//            $http.post('/investigations/find', {case: investigation.pat_case_id}).
//                    success(function (response) {
//                        $scope.investigations = response;
//                        return $scope.investigations;
//                    });

        };

        /**
         * List all investigation for that case
         *  
         */
        $scope.listInv = function (id) {
            //console.log(id);
            $http.post('/investigations/find', {case: id}).
                    success(function (response) {
                        $scope.investigations = response;
                        return $scope.investigations;
                    });

        };

        /**
         * Funciton that calls all investigations linked with a case selected by the user and sets them to the current investigation scope         
         *  
         */
        $scope.getCaseInvs = function (cCase) {
            $http.post('/investigations/find', {id: cCase._id}).
                    success(function (response) {
                        console.log('response');
                        console.log(response);
                        $scope.caseInvestigations = response;
                        return     $scope.caseInvestigations;
                    });
        };

        /**
         * Function to return all variant detail from id
         * 
         * @param {String} varId - varaint id
         * @returns {Varaint}
         */
        $scope.getVariant = function (varId) {

            //console.log(varId);

            $http.post('/variant/id', {id: varId}).
                    success(function (response) {
                        $scope.variantInfo = response[0];
                        return $scope.variantInfo;
                    });
        };

        /**
         * Function which takes a gene and returns all known disease linked with that gene from OMIM
         * 
         * @param {String} gene
         * @returns {String} Diseases
         */
        $scope.searchOmimGene = function (gene) {

            $http.post('/omims/gene', {
                search: gene
            })
                    .success(function (data) {
                        $scope.omsGenes = data;
                        return $scope.omsGenes;
                    });

        };


        ///////////OMIM API////////////////////

        $scope.api = 'empty';

        /**
         * Method that takes a OMIM ID from the variant and requests OMIM data from OMIM API
         * 
         * @param {variant} vari
         * @returns {scope}
         */
        $scope.getOmim = function (vari) {



            if (vari === 'NA') {
                $scope.api = 'noOmim';
            } else if (vari) { //checks to see if a variant has been selected


                var x = vari.split('('); //breaks down the OMIM link to get OMIM id
                x = x[1].split('/');
                x = x[x.length - 1].split('\'');

                $scope.omimApi = x;


            }

        };

        /**
         * takes a variant and sets the Clinvar resutls in the scope
         * 
         * @param {type} gene
         * @param {type} start
         * @returns {scope}
         */
        $scope.setClinvarVariant = function (gene, start) {
            $http.post('/clinvar', {search: [gene, start]}).
                    success(function (response) {
                        $scope.clinvarVar = response;
                        return $scope.clinvarVar;
                    });
        };


        ///////////Logs////////////

        $scope.logVariant = function (vrt, cId, iId) {

//            console.log(vrt);
//            console.log(cId);
//            console.log(iId);




            var log = new Logs({
                patient_id: cId.patient_id.pat_id,
                case_id: cId._id,
                action: {
                    collection: 'Variant',
                    variant: {
                        info: 'Variant was edited',
                        _id: vrt._id,
                        gene: vrt.Gene_knownGene,
                        pos: vrt.Start,
                        maf: vrt.maf_1000g2012apr_all,
                        func: vrt.Func_knownGene
                    },
                    investigation: {
                        id: iId._id,
                        title: iId.inv_name,
                        phenotypes: iId.info.phenotype,
                        created: iId.created,
                        omim_var: iId.omim_variant_ids,
                        clinvar: iId.clinvar_variant_ids
                    },
                    patCase: {
                        id: cId._id,
                        name: cId.case_name
                    }
                }
            });

            //     console.log(log);

            $http.post('/logs', log);


        };
    }
]);