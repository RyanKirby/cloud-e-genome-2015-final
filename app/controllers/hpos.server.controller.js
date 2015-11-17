'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors.server.controller'),
        Hpo = mongoose.model('Hpo'),
        _ = require('lodash');

/**
 * Create a Hpo
 */
exports.create = function (req, res) {
    var hpo = new Hpo(req.body);
    hpo.user = req.user;

    hpo.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(hpo);
        }
    });
};

/**
 * Show the current Hpo
 */
exports.read = function (req, res) {
    res.jsonp(req.hpo);
};

/**
 * Update a Hpo
 */
exports.update = function (req, res) {
    var hpo = req.hpo;

    hpo = _.extend(hpo, req.body);

    hpo.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(hpo);
        }
    });
};

/**
 * Delete an Hpo
 */
exports.delete = function (req, res) {
    var hpo = req.hpo;

    hpo.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(hpo);
        }
    });
};


/**
 * List of Hpos
 */
exports.list = function (req, res) {

    var srch = req.body.search;
    console.log(srch);
    Hpo.find({$or: [{disease: {$regex: srch, $options: 'i'}}, {info: {$regex: srch, $options: 'i'}}]}).exec(function (err, hpos) {
        // Hpo.find({}).exec(function (err, hpos) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(hpos);
        }
    });
};

/**
 * Hpo middleware
 */
exports.hpoByID = function (req, res, next, id) {
    Hpo.findById(id).populate('user', 'displayName').exec(function (err, hpo) {
        if (err)
            return next(err);
        if (!hpo)
            return next(new Error('Failed to load Hpo ' + id));
        req.hpo = hpo;
        next();
    });
};

/**
 * Hpo authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.hpo.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
