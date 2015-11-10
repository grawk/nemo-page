'use strict';

var ElementModel = require('./element'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log');

var PresentModel = function (config, parent, nemo, drivex) {
    log('PresentModel: Initializing Present Model');

    // Initialize the base model object
    var base = ElementModel(config, parent, nemo, drivex);

    // Extend the base model with this models functions
    _.extend(base, {
        collect: function (baseOverride) {
            return base.isPresent(baseOverride);
        }
    });

    return base;
};

module.exports = PresentModel;