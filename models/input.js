'use strict';

var ElementModel = require('./element'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log');

var InputModel = function (config, parent, nemo, drivex) {
    log('InputModel: Initializing Input Model');

    config = _.defaults(_.clone(config), { '_data': 'attribute:value' });

    // Initialize the base model object
    var base = ElementModel(config, parent, nemo, drivex);

    // Extend the base model with this models functions
    _.extend(base, {
        setValue: function (data, baseOverride) {
            return nemo.page.doOperationWithRetry(function () {
                var element = base.get(baseOverride);
                element.clear();
                return element.sendKeys(data);
            }, nemo.page.NUM_RETRIES);
        }
    });

    return base;
};

module.exports = InputModel;