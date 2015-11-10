'use strict';

var ElementModel = require('./element'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log');

var HtmlModel = function (config, parent, nemo, drivex) {
    log('HtmlModel: Initializing HTML Model');

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
                    return base.get(baseElement).getInnerHtml().then(function (value) {
                        if (_.isString(value)) {
                            value = value.trim();
                        }

                        return value;
                    });
                }
            });
        }
    });

    return base;
};

module.exports = HtmlModel;