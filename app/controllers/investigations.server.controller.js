'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors.server.controller'),
        Investigation = mongoose.model('Investigation'),
        _ = require('lodash');

/**
 * Create a Investigation
 */
exports.create = function (req, res) {
    var investigation = new Investigation(req.body.inv);
    investigation.user = req.user;

    investigation.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(investigation);
        }
    });
};

/**
 * Show the current Investigation
 */
exports.read = function (req, res) {
    res.jsonp(req.investigation);
};

/**
 * Update a Investigation
 */
exports.update = function (req, res) {
    var investigation = req.investigation;

    investigation = _.extend(investigation, req.body);

    investigation.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(investigation);
        }
    });
};

/**
 * Delete an Investigation
 */
exports.delete = function (req, res) {

    var id = req.body.id;
    var case_id = req.body.case_id;

    Investigation.remove({_id: id}).exec(function (err, investigations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Investigation.find({pat_case_id: case_id}).exec(function (err, investigations) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(investigations);
                }
            });
        }
    });
};

exports.findAll = function(req, res) {
    
     Investigation.find({}).exec(function (err, investigations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(investigations);
        }
    });
    
};


/**
 * List of Investigations
 */
exports.findInvsByVar = function (req, res) {

    var start = req.body.start;
    var gene = req.body.gene;

    Investigation.find({omim_variant_ids: {$elemMatch: { Start: start, Gene_knownGene: gene}}}).exec(function (err, investigations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(investigations);
        }
    });
};

/**
 * List of Investigations
 */
exports.findInvsByGene = function (req, res) {

    var gene = req.body.gene;

    Investigation.find({omim_variant_ids: {$elemMatch: {Gene_knownGene: gene}}}).exec(function (err, investigations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(investigations);
        }
    });
};




/**
 * List of Investigations
 */
exports.list = function (req, res) {

    var id = req.body.case;

    Investigation.find({pat_case_id: id}).exec(function (err, investigations) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(investigations);
        }
    });
};

exports.updateInv = function (req, res) {

    var inv = req.body.inv;
    var omim = req.body.omim;
    var update = {};
    if (inv.info) {
        update.info = inv.info;
    }
    if (omim) {
        update.omim_variant_ids = omim;
    }

    Investigation.update({_id: inv._id}, {$set: update}).exec(function (err, investigation) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(investigation);
        }
    });
};



/**
 * Investigation middleware
 */
exports.investigationByID = function (req, res, next, id) {
    Investigation.findById(id).populate('user', 'displayName').exec(function (err, investigation) {
        if (err)
            return next(err);
        if (!investigation)
            return next(new Error('Failed to load Investigation ' + id));
        req.investigation = investigation;
        next();
    });
};

/**
 * Investigation authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.investigation.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
