'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Hpo Schema
 */
var HpoSchema = new Schema({
	_id: {
		type: String
		
	},
	disease: {
		type: String
	},
	info: {
		type: String
	}
});

mongoose.model('Hpo', HpoSchema);