'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        errorHandler = require('./errors.server.controller'),
        PatCase = mongoose.model('PatCase'),
        _ = require('lodash');

/**
 * Create a Pat case
 */
exports.create = function (req, res) {

    var patCase = new PatCase(req.body);
    patCase.user = req.user;

    patCase.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(patCase);
        }
    });
};

/**
 * Show the current Pat case
 */
exports.read = function (req, res) {
    res.jsonp(req.patCase);
};







/**
 * Update a Pat case
 */
exports.update = function (req, res) {
    var patCase = req.patCase;

    patCase = _.extend(patCase, req.body);

    patCase.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(patCase);
        }
    });
};

/**
 * Delete an Pat case
 */
exports.delete = function (req, res) {
    var patCase = req.body.patCase;

    PatCase.remove({_id: patCase._id}).exec(function (err, patCases) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            PatCase.find({}).exec(function (err, patCases) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(patCases);
                }
            });
        }
    });
};

var query = {};

var findById = function (srh) {
    query = {_id: srh};
};

exports.request = function (req, res) {

    var search = req.body.search;
    var searchType = req.body.srh_type;

    if (searchType === 'findById') {
        findById(search);
    }

};


exports.findId = function (req, res) {
    
    var patId = req.body.id;
    console.log(patId);
    
    PatCase.find({_id: patId}).exec(function (err, patCases) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(patCases);
            console.log(patCases)
        }
    });
};



/**
 * List of Pat cases
 */
exports.list = function (req, res) {
    PatCase.find(query).exec(function (err, patCases) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(patCases);
            query = {};
        }
    });
};

/**
 * Pat case middleware
 */
exports.patCaseByID = function (req, res, next, id) {
    PatCase.findById(id).populate('user', 'displayName').exec(function (err, patCase) {
        if (err)
            return next(err);
        if (!patCase)
            return next(new Error('Failed to load Pat case ' + id));
        req.patCase = patCase;
        next();
    });
};

/**
 * Pat case authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.patCase.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
