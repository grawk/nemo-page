'use strict';

var BaseModel = require('./base'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log');

var ObjectModel = function (config, parent, nemo, drivex) {
    log('ObjectModel: Initializing Object Model');

    // Initialize the base model object
    var mappings = require('../lib/typeMappings').getMappings(),
        base = BaseModel(config, parent, nemo, drivex),
        fields = {};

    // Extend the base model with this models functions
    _.extend(base, {
        collect: function (baseOverride) {
            var promiseList = [],
                data = {};

            base.getBase(true);

            _.each(fields, function (field, key) {
                var promise = field.collect(baseOverride).then(function (value) {
                    if (_.isString(value)) {
                        value = value.trim();
                    }
                    if (!_.isUndefined(value)) {
                        data[key] = value;
                    }
                });

                promiseList.push(promise);
            });

            return nemo.wd.promise.all(promiseList).then(function () {
                base._clearBase(true);
                if (!_.isEmpty(data)) {
                    return data;
                } else {
                    return undefined;
                }
            });
        },

        setValue: function (data) {
            var promiseList = []
            _.each(data, function (value, key) {
                var field = fields[key];

                if (field && field.setValue) {
                    promiseList.push(field.setValue(value));
                } else {
                    log('ObjectModel: setValue: No appropriate field found for ' + key);
                }
            })
        }
    });

    // Build the child fields
    _.each(config, function (value, key) {
        var modelObj;

        // Ignore any fields which either use the reserved '_' at the beginning or have a key that maps to a function on base.
        if (key.indexOf('_') === 0 || base[key]) {
            log('ObjectModel: Found key ' + key + ' which is reserved. Ignoring');
            return;
        }

        if (!value['_model']) {
            modelObj = mappings.element;
        } else {
            modelObj = mappings[value['_model']];

            if (modelObj.isAbstract) {
                throw new Error('[nemo-page] Cannot create models that are abstract');
            }
        }

        fields[key] = modelObj(value, base, nemo, drivex);
    });

    // Add the fields to the model object
    _.extend(base, fields);

    return base;
};

module.exports = ObjectModel;