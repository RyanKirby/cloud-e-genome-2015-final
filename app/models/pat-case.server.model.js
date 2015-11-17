'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pat case Schema
 */
var PatCaseSchema = new Schema({
	case_name: String,
        patient_id: {},        
	created: {
		type: Date,
		default: Date.now
	},
	user: {
	},
        comment: [String],
        inv_id: [String],
        log_ids: [String]
});

mongoose.model('PatCase', PatCaseSchema);