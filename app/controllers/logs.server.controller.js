'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors.server.controller'),
        Log = mongoose.model('Log'),
        _ = require('lodash');

/**
 * Create a Log
 */
exports.create = function (req, res) {
    var log = new Log(req.body);
    log.user = req.user;

    log.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(log);
        }
    });
};

/**
 * Show the current Log
 */
exports.read = function (req, res) {
    res.jsonp(req.log);
};

/**
 * Update a Log
 */
exports.update = function (req, res) {
    var log = req.log;

    log = _.extend(log, req.body);

    log.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(log);
        }
    });
};

/**
 * Delete an Log
 */
exports.delete = function (req, res) {
    var log = req.log;


    log.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(log);
        }
    });
};

/**
 * List of Logs
 */
exports.list = function (req, res) {
    Log.find().sort('-created').exec(function (err, logs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(logs);
        }
    });
};

exports.userList = function (req, res) {

    var user = req.body.user.user;

    if (user !== '') {
        Log.find({$and: [{'user.displayName': user.displayName}, {'user.email': user.email}]}).exec(function (err, logs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(logs);
            }
        });
    }
};



exports.patientList = function (req, res) {

    var patientId = req.body.id;
    if (patientId !== '') {
        Log.find({patient_id: patientId}).exec(function (err, logs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(logs);
                patientId = '';
            }
        });
    }
};


exports.caseList = function (req, res) {

    var caseId = req.body.id;
    if (caseId !== '') {
        Log.find({case_id: caseId}).exec(function (err, logs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(logs);
                caseId = '';
            }
        });
    }
};


exports.variantList = function (req, res) {

    var gene = req.body.gene;
    var pos = parseInt(req.body.pos);
    
    console.log(pos);

    if (varId !== '') {
        Log.find({'action.variant.pos': pos}).exec(function (err, logs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(logs);
                console.log(logs);
            }
        });
    }
};

//553763acb00f691e1df3b6f7
exports.variantCrossSearch = function (req, res) {


    var gene = req.body.gene;
    var pos = parseInt(req.body.pos);

    Log.find({$and: [{'action.collection':'Variant'}, {'action.variant.gene': gene}, {'action.variant.pos': pos}]}).exec(function (err, logs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                console.log(logs);
                res.jsonp(logs);
            }
        });
    
};

exports.geneCrossSearch = function (req, res) {

    var gene = req.body.gene;

    Log.find({$and: [{'action.collection':'Variant'}, {'action.variant.gene': gene}]}).exec(function (err, logs) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(logs);
            }
        });
    
};

/**
 * Log middleware
 */
exports.logByID = function (req, res, next, id) {
    Log.findById(id).exec(function (err, log) {
        if (err)
            return next(err);
        if (!log)
            return next(new Error('Failed to load Log ' + id));
        req.log = log;
        next();
    });
};

/**
 * Log authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.log.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
