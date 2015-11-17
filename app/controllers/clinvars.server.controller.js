'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors.server.controller'),
        Clinvar = mongoose.model('Clinvar'),
        _ = require('lodash');

/**
 * Create a Clinvar
 */
exports.create = function (req, res) {
    var clinvar = new Clinvar(req.body);
    clinvar.user = req.user;

    clinvar.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(clinvar);
        }
    });
};

/**
 * Show the current Clinvar
 */
exports.read = function (req, res) {
    res.jsonp(req.clinvar);
};

/**
 * Update a Clinvar
 */
exports.update = function (req, res) {
    var clinvar = req.clinvar;

    clinvar = _.extend(clinvar, req.body);

    clinvar.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(clinvar);
        }
    });
};

/**
 * Delete an Clinvar
 */
exports.delete = function (req, res) {
    var clinvar = req.clinvar;

    clinvar.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(clinvar);
        }
    });
};

exports.listOne = function(req, res) {

    var gene = req.body.search;

    var x = gene[0] + '-' + gene[1];
 
    Clinvar.find({MongoSearch: x}).exec(function (err, clinvars) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(clinvars);

        }
    });
};


/**
 * List of Clinvars
 */
exports.list = function (req, res) {

    var gene = req.body.search;

    var x = [];
    for (var i = 0; i < gene.length; i++) {

         x.push(gene[i][0] + '-' + gene[i][1]);
    }
 
    Clinvar.find({MongoSearch: {$in: x}}, {GeneSymbol: 1, Start: 1, ClinicalSignificance: 1}).exec(function (err, clinvars) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(clinvars);

        }
    });
};

/**
 * Clinvar middleware
 */
exports.clinvarByID = function (req, res, next, id) {
    Clinvar.findById(id).populate('user', 'displayName').exec(function (err, clinvar) {
        if (err)
            return next(err);
        if (!clinvar)
            return next(new Error('Failed to load Clinvar ' + id));
        req.clinvar = clinvar;
        next();
    });
};

/**
 * Clinvar authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.clinvar.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
