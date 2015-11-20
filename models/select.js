'use strict';

var ElementModel = require('./element'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

var SelectModel = function (config, parent, nemo, drivex) {
    log('SelectModel: Initializing Select Model');

    // Initialize the base model object
    var base = ElementModel(config, parent, nemo, drivex);

    // Extend the base model with this models functions
    _.extend(base, {
        collect: function (baseOverride) {
            var baseElement;

            if (baseOverride) {
                baseElement = baseOverride;
            } else {
                baseElement = base._getBase();
            }

            return drivex.present(base.locator(), baseElement).then(function (isPresent) {
                if (isPresent) {
                    return base.get(baseElement).getAttribute('value').then(function (value) {
                        if (_.isString(value)) {
                            value = value.trim();
                        }

                        return value;
                    });
                }
            });
        },

        setValue: function (data, baseOverride) {
            var element = base.get(baseOverride),
                optionLoc = normalize(nemo, {
                    locator: 'option[value="' + data + '"]',
                    type: 'css'
                });
            drivex.find(optionLoc, element).click();
        }
    });

    return base;
};

module.exports = SelectModel;