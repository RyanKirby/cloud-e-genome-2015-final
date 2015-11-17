'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Log Schema
 */
var LogSchema = new Schema({
    time_stamp: {
        type: Date,
        default: Date.now
    },
    user: {},
    patient_id: String,
    case_id: String,
    action: {}
});

mongoose.model('Log', LogSchema);