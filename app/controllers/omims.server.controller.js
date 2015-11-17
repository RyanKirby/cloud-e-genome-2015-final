'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors.server.controller'),
        Omim = mongoose.model('Omim'),
        _ = require('lodash');



/**
 * Show the current Omim
 */
exports.read = function (req, res) {
    res.jsonp(req.omim);
};


/**
 * List of Omims
 */
exports.list = function (req, res) {

    var search = req.body.search;
    var genes = [];

    console.log(search);

    for (var i = 0; i < search.length; i++) {
        search[i] = new RegExp('.*' + search[i] + '.*', 'i');
    }


    Omim.find({info: {$in: search}}).sort({gene: '1'}).exec(function (err, omims) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            for (var i = 0; i < omims.length; i++) {

                var gene = omims[i].gene.split(',');
                for (var g = 0; g < gene.length; g++) {
                    genes.push({
                        gene_split: gene[g],
                        omim_id: omims[i]._id});
                }
            }
        }

        res.jsonp(genes);
        search = '';
        genes = [];
    });
};


exports.listDisease = function (req, res) {

    var geneSearch = req.body.search;

    Omim.find({gene: {$regex: geneSearch, $options: 'i'}}).sort({gene: '1'}).exec(function (err, omims) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            res.jsonp(omims);
            geneSearch = '';
        }
    });
};

/**
 * Omim middleware
 */
exports.omimByID = function (req, res, next, id) {
    Omim.findById(id).populate('user', 'displayName').exec(function (err, omim) {
        if (err)
            return next(err);
        if (!omim)
            return next(new Error('Failed to load Omim ' + id));
        req.omim = omim;
        next();
    });
};

/**
 * Omim authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.omim.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
