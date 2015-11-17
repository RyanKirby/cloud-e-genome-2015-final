'use strict';

angular.module('pat-cases').controller('ViewManagerController', ['Authentication', '$scope',
    function (Authentication, $scope) {




        $scope.rowCollection = [];

        $scope.displayedCollection = [];




        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.authentication = Authentication;


        /////////////options-investigations controller////////////////


        $scope.inSub = [true, false];

        $scope.invSubOpt = function (index) {
            for (var i = 0; i < $scope.inSub.length; i++) {
                $scope.inSub[i] = false;
            }
            $scope.inSub[index] = true;
        };


        /////////////////////////end/////////////////////////////


        $scope.finish = false;

        $scope.omimSearch = 'empty';
        $scope.caseSelected = false;
        $scope.progressBar = '0%';
        $scope.variant = 'empty';
        $scope.panel = [true, false, false, false, false, false, false]; //variant, omim, clinvar, hpo, view, variant, edit

        /**
         * updates the panel
         * 
         * @param {type} index
         * @returns {scope}
         */
        $scope.selectPanel = function (index) {
            for (var i = 0; i < $scope.panel.length; i++) {
                $scope.panel[i] = false;
            }
            $scope.panel[index] = true;
        };

        /**
         * update the variant scope
         * 
         * @param {type} variant
         * @returns {scope}
         */
        $scope.setVariant = function (variant) {
            $scope.variant = variant;
        };

        /**
         * rest the investigation in scope
         * 
         * @returns {scope}
         */
        $scope.restInv = function () {
            $scope.variant = 'empty';
        };

        /**
         * sets the sellected case into scope
         * 
         * @param {type} cCase
         * @returns {scope}
         */
        $scope.selectCase = function (cCase) {
            $scope.currentCase = cCase;
        };

        /**
         * shows the current case
         * 
         * @param {type} x
         * @returns {scope}
         */
        $scope.viewCase = function (x) {
            $scope.caseSelected = x;
        };

        $scope.newCaseFunc = function (x) {
            $scope.newCase = x;
        };

        $scope.omimSelected = function (x) {
            if (x === true) {
                $scope.omimSearch = 'selected';
            } else {
                $scope.omimSearch = 'empty';
            }
        };

        var counter = 0;
        $scope.newInvSections = [];
        $scope.phenotypes = [];
        $scope.phenotype = '';
        $scope.button = 'Next';

        /**
         * Function to rest all scopes for a new investigation
         * 
         * @returns {scope}
         */
        $scope.clearNewInv = function () {
            counter = 0;
            $scope.sections = [];
            $scope.newInvSections = [];
            $scope.phenotypes = [];
            $scope.phenotype = '';
            $scope.button = 'Next';
            $scope.currentInvestigation = {};
            $scope.newInvestigation = {};
        };

        /**
         * Function to add a phenotype to the scope array
         * 
         * @param {type} pheno
         * @returns {scope}
         */
        $scope.addPheno = function (pheno) {
            $scope.overview = 'searching';
            $scope.phenotypes.push(pheno);
        };

        /**
         * Function to remove a phenotype from the phenotype array in the scope
         * 
         * @param {type} index
         * @returns {scope}
         */
        $scope.removePheno = function (index) {
            $scope.phenotypes.splice(index, 1);
        };

        /**
         * function to update the investigation to scope
         * 
         * @returns {scope}
         */
        $scope.setNewInv = function () {
            $scope.newInv = 'createInv';
        };

        /**
         * function to clear investigation in scope
         * 
         * @returns {scope}
         */
        $scope.restInv = function () {
            $scope.newInv = '';
        };

        $scope.currentInvestigation = {};

        /**
         * function that handles pressing enter in the new investigation slider
         * 
         * @param {type} keyEvent
         * @param {type} name
         * @param {type} phenotype
         * @param {type} gene
         * @param {type} pat
         * @returns {scope}
         */
        $scope.pressEnter = function (keyEvent, name, phenotype, gene, pat) {
            if (keyEvent.which === 13) {
                $scope.popNext(name, phenotype, gene, pat);
            }
        };

        /**
         * Function which handles the new investigation slider options 
         */
        $scope.popNext = function (name, phenotype, gene, pat) {

            //console.log(counter);
            if (counter === 0) {
                $scope.finish = false;
                if (!name) {
                    $scope.warning = 'Please enter a Investigation name to continue.';
                } else {
                    counter++;
                    $scope.progressBar = '50%';
                    $scope.newInvSections.push(counter);
                    $scope.currentInvestigation.inv_name = name;
                    $scope.warning = '';
                }
            } else if (counter === 1) {
                if (gene === true) {
                    counter++;
                    $scope.newInvSections.push(counter);
                    $scope.phenotypes.push('User will define genes');
                } else if (!phenotype) {
                    $scope.warning = 'Please enter a Investigation name to continue.';
                } else {
                    counter++;
                    $scope.progressBar = '100%';
                    $scope.newInvSections.push(counter);
                    $scope.currentInvestigation.info = {phenotype: [phenotype]}; //
                    $scope.currentInvestigation.pat_case_id = pat; //
                    $scope.phenotypes.push(phenotype);
                    $scope.button = 'Finished';
                    $scope.warning = '';
                }
            } else if (counter === 2) {

                $scope.finish = true;
                $scope.progressBar = '0%';
                $scope.newInv = 'invInfo';
                counter = 0;
                $scope.warning = '';
                $scope.newInvestigation = $scope.currentInvestigation;
            }
        };
        /**
         * Function for the back button on new investigation slider
         * 
         */
        $scope.barBack = function () {

            if ($scope.newInvSections.length === 2) {
                $scope.progressBar = '50%';
            } else {
                $scope.progressBar = '0%';
            }

            if ($scope.newInvSections.length > 0) {
                $scope.newInvSections.pop();
                counter--;
            }
            if ($scope.newInvSections.length < 2) {
                $scope.button = 'Next';
            }
        };
        /**
         * Updates current investigation
         * 
         */
        $scope.selectInvestigation = function (inv) {
            $scope.currentInvestigation = inv;
            $scope.phenotypes = $scope.currentInvestigation.info.phenotype;
            $scope.newInv = 'invInfo';
            //console.log($scope.phenotypes);
            console.log(inv);
        };

        $scope.selected = [];

        $scope.resetSlected = function (num) {
            $scope.selected = [];
            for (var i = 0; i < num; i++) {
                $scope.selected.push('');
            }
        };
        $scope.selected = function (index, num) {
            //console.log(num, index);
            for (var i = 0; i < num; i++) {
                $scope.selected[i] = '';
            }
            $scope.selected[index] = 'selected';
        };

////////////////////////////////////other functions///////////////////////

        $scope.omimNewText = [];
        $scope.omimNewVar = [];
        $scope.omimText = [];
        $scope.omimText = function (index, text, num) {

            //console.log(text);
            var spl = text.split('{');
            //console.log(spl);

            var re = /(.*?)\}/;
            var newText = '';
            for (var i = 0; i < spl.length; i++) {

                var ref;
                var mat = re.exec(spl[i]);
                if (mat) {
                    if (isNaN(mat[1])) {
                        ref = '<a class=clickable><small><i>' + mat[1] + '</i></small></a>';
                    } else {
                        ref = '<a class="clickable" href="http://www.omim.org/entry/' + mat[1] + '?search=' + mat[1] + '" target="_blank">' + mat[1] + '</a>'; //<a  target="_blank">Go to Yahoo</a> 
                    }

                }
                //console.log(mat);
                var newtext = spl[i].replace(re, ref);
                newText = newText + newtext;
            }

            var r = /\n/g;
            var x = newText.replace(r, '<br>');
            if (num === 0) {
                $scope.omimNewText[index] = x;
            } else if (num === 1) {
                $scope.omimNewVar[index] = x;
            }

        };
        $scope.details = [];
        /**
         * takes a text from omim and organises it, and adds omim links
         * 
         * @param {type} text
         * @returns {undefined}
         */
        $scope.omimDisease = function (index, text) {
            var newText = text.split(/[;,]+/);
            // console.log(newText);
            var dets = [];
            for (var i = 0; i < newText.length; i++) {
                if (newText[i].match(/(3)/g)) {
                    var x = newText[i].substring(0, newText[i].length - 4);
                    //console.log(x);
                    dets.push(' <a class="clickable" href="http://www.omim.org/entry/' + x.trim() + '?search=' + x.trim() + '" target="_blank">' + x.trim() + '</a>');
                } else {
                    dets.push(newText[i]);
                }
                $scope.details[index] = dets;
            }
        };

    }
]);