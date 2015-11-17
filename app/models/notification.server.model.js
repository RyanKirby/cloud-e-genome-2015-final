'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
    title: {
        type: String
    },
    details: {},
    created: {},
    user: {}
});

mongoose.model('Notification', NotificationSchema);