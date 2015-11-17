'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Investigation Schema
 */
var InvestigationSchema = new Schema({
    inv_name: String,
    pat_case_id: String,
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    omim_variant_ids: [],
    clinvar_variant_ids: [],
    info:{},
    comment_ids: [String]

});

mongoose.model('Investigation', InvestigationSchema);