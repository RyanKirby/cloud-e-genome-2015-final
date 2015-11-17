'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Omim Schema
 */
var OmimSchema = new Schema({
    gene: String,
    info: String	
});

mongoose.model('Omim', OmimSchema);