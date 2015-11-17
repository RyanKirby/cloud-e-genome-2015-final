'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors.server.controller'),
        Variant = mongoose.model('Variant'),
        Clinvar = mongoose.model('Clinvar'),
        Omim = mongoose.model('Omim'),
        _ = require('lodash');

/**
 * Create a Variant
 */
exports.create = function (req, res) {
    var variant = new Variant(req.body);
    variant.user = req.user;

    variant.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(variant);
        }
    });
};

/**
 * Show the current Variant
 */
exports.read = function (req, res) {
    res.jsonp(req.variant);
};

/**
 * Update a Variant
 */
exports.update = function (req, res) {
    var variant = req.variant;

    variant = _.extend(variant, req.body);

    variant.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(variant);
        }
    });
};

/**
 * Delete an Variant
 */
exports.delete = function (req, res) {
    var variant = req.variant;

    variant.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(variant);
        }
    });
};





/**
 * Takes a patient_id and creates a search parimieter to return all varaints for that patient
 * 
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
exports.searchVar = function (req, res) {

};

exports.listOmim = function (req, res) {
  
    
    var phenotype = req.body.pheno;
    var patId = req.body.patId;


    var genes = [];

    console.log('Pheno = ' + phenotype);
    console.log('Patient id = ' + patId);
    var phen = phenotype;

    console.log(phenotype.length);

    var spliceIndex = [];

    for (var i = 0; i < phenotype.length; i++) {
        if (phenotype[i] === '') {
            spliceIndex.push(i);
        } else {
            phenotype[i] = new RegExp('.*' + phenotype[i] + '.*', 'i');
        }
    }

    for (var i = 0; i < spliceIndex.length; i++) {
        var x = spliceIndex[i];
        phenotype.splice(x, 1);
        console.log('POP!');
    }


    Omim.distinct('gene', {info: {$in: phenotype}}).exec(function (err, omims) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            for (var x = 0; x < omims.length; x++) {
                var split = omims[x].split(',');
                if (split.length > 1) {
                    for (var i = 0; i < split.length; i++) {
                        genes.push(split[i].trim());
                    }
                } else {
                    genes.push(split[0].trim());
                }
            }


            var query = {$and: [{Patient: patId}, {Gene_knownGene: {$in: genes}}, {ExonicFunc_knownGene: {$ne: 'synonymous SNV'}}, {ExonicFunc_knownGene: {$ne: ''}}]}; // {maf_1000g2012apr_all: { $lt : 0.5}}, 

            Variant.find(query, {_id: 1, Patient: 1, Start: 1, Gene_knownGene: 1, Func_knownGene: 1, ExonicFunc_knownGene: 1, maf_1000g2012apr_all: 1, IA_OMIMLink: 1}).exec(function (err, variants) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(variants);
                }
            });
        }
    });

    
    
//    console.log('List Omim Request');
//    var phenotype = req.body.pheno;
//    var patId = req.body.patId;
//    var genes = [];
//    var response = [];
//
//    console.log(phenotype.length);
//
//    for (var i = 0; i < phenotype.length; i++) {
//
//        Omim.distinct('gene', {info: {$regex: phenotype[i], $options: 'i'}}).exec(function (err, omims) {
//            if (err) {
//                return res.status(400).send({
//                    message: errorHandler.getErrorMessage(err)
//                });
//            } else {
//                for (var x = 0; x < omims.length; x++) {
//                    var split = omims[x].split(',');
//                    if (split.length > 1) {
//                        for (var i = 0; i < split.length; i++) {
//                            genes.push(split[i].trim());
//                        }
//                    } else {
//                        genes.push(split[0].trim());
//                    }
//                }
//                var query = {$and: [{Patient: patId}, {Gene_knownGene: {$in: genes}}, {ExonicFunc_knownGene: {$ne: 'synonymous SNV'}}, {ExonicFunc_knownGene: {$ne: ''}}]}; // {maf_1000g2012apr_all: { $lt : 0.5}}, 
//                var response = [];
//
//
//                Variant.find(query, {_id: 1, Start: 1, Gene_knownGene: 1, Func_knownGene: 1, ExonicFunc_knownGene: 1, maf_1000g2012apr_all: 1, IA_OMIMLink: 1}).exec(function (err, variants) {
//                    if (err) {
//                        return res.status(400).send({
//                            message: errorHandler.getErrorMessage(err)
//                        });
//                    } else {
//                        if (phenotype.length === 1) {
//                            res.jsonp(variants);
//                        } else if (phenotype.length > i) {
//                            for (var v = 0; v < variants.length; v++) {
//                                response.push(variants[v]);
//                            }
//                        } else if (phenotype.length-1 === i) {
//                            response.push(variants[v]);
//                            res.jsonp(response);
//                        }
//
//                    }
//                });
//            }
//        });
//    }
};



exports.overview = function (req, res) {
    var phenotype = req.body.pheno;
    var patId = req.body.patId;
    var genes = [];
    var phen = phenotype;

    Omim.distinct('gene', {info: {$regex: phenotype, $options: 'i'}}).exec(function (err, omims) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            for (var x = 0; x < omims.length; x++) {
                var split = omims[x].split(',');
                if (split.length > 1) {
                    for (var i = 0; i < split.length; i++) {
                        genes.push(split[i].trim());
                    }
                } else {
                    genes.push(split[0].trim());
                }
            }

            var query = {$and: [{Patient: patId}, {Gene_knownGene: {$in: genes}}, {ExonicFunc_knownGene: {$ne: 'synonymous SNV'}}, {ExonicFunc_knownGene: {$ne: ''}}]}; // {maf_1000g2012apr_all: { $lt : 0.5}}, 

            Variant.find(query, {_id: 1,Patient:1, Start: 1, Gene_knownGene: 1, Func_knownGene: 1, ExonicFunc_knownGene: 1, maf_1000g2012apr_all: 1, IA_OMIMLink: 1}).exec(function (err, variants) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    
                    console.log(variants);
                    var patVar = [];
                    var vrnt = [];

                    for (var xx = 0; xx < variants.length; xx++) {
                        vrnt.push([variants[xx]._id, variants[xx].Gene_knownGene, variants[xx].Start]);
                        patVar.push(variants[xx].Gene_knownGene + '-' + variants[xx].Start);

                    }

                    var amber = [], green = [], red = [];

                    Clinvar.find({MongoSearch: {$in: patVar}}, {GeneSymbol: 1, Start: 1, ClinicalSignificance: 1}).sort({ClinicalSignificance: 1}).exec(function (err, clinvars) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {


                            for (var i = 0; i < clinvars.length; i++) {
                                if (clinvars[i].ClinicalSignificance === 'Pathogenic') {
                                    red.push(clinvars[i]);
                                } else if (clinvars[i].ClinicalSignificance === 'Benign') {
                                    green.push(clinvars[i]);
                                } else {
                                    amber.push(clinvars[i]);
                                }
                            }

                            var clin = {};
                            clin.red = red;
                            clin.green = green;
                            clin.amber = amber;

                            res.jsonp({omim: {omim_size: genes.length,
                                    phenotype: phen},
                                pat_var: {variants: vrnt,
                                    omim_phenotype: phen},
                                clinvar: {
                                    clin_results: clin,
                                    omim_pat_phenotype: phen
                                }});
                        }
                    });

                }
            });
        }
    });

};

/**
 * List of Variants
 */
exports.list = function (req, res) {

    /**
     * returns a list of variants
     */


    var search = req.body.search;
    var gene = req.body.gene;
    var query = {$and: [{Patient: search}, {Gene_knownGene: {$in: gene}}, {ExonicFunc_knownGene: {$ne: 'synonymous SNV'}}, {ExonicFunc_knownGene: {$ne: ''}}]}; // {maf_1000g2012apr_all: { $lt : 0.5}}, 

    Variant.find(query, {Gene_knownGene: 1, Start: 1}).limit(40).exec(function (err, variants) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(variants); //returns variants length
        }
    });

//     Variant.find(query, {item: 1, qty: 1}).exec(function (err, variants) {
//        if (err) {
//            return res.status(400).send({
//                message: errorHandler.getErrorMessage(err)
//            });
//        } else {
//            res.jsonp(variants); //returns variants length
//            query = {};
//        }
//    });
};


exports.variantId = function (req, res) {
    var id = req.body.id;
    Variant.find({_id: id}).exec(function (err, variant) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(variant); //returns variants length
        }
    });

};


/**
 * Variant middleware
 */
exports.variantByID = function (req, res, next, id) {
    Variant.findById(id).populate('user', 'displayName').exec(function (err, variant) {
        if (err)
            return next(err);
        if (!variant)
            return next(new Error('Failed to load Variant ' + id));
        req.variant = variant;
        next();
    });
};

/**
 * Variant authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.variant.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
