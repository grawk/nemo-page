'use strict';

var BaseModel = require('./base'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

var ArrayModel = function (config, parent, nemo, drivex) {
    log('ArrayModel: Initializing Array Model');

    // Initialize the base model object
    var mappings = require('../lib/typeMappings').getMappings(),
        base = BaseModel(config, parent, nemo, drivex),
        itemsLocator = normalize(nemo, config['_itemsLocator']),
        itemModel,
        itemObj;

    if (config['_itemModel']) {
        itemModel = mappings[config['_itemModel']];
    } else {
        itemModel = mappings.text;
    }

    itemObj = itemModel(config, undefined, nemo, drivex);

    // Extend the base model with this models functions
    _.extend(base, {
        collect: function (baseOverride) {
            var baseElement;

            if (baseOverride) {
                baseElement = baseOverride;
            } else {
                baseElement = base._getBase(true);
            }

            return drivex.finds(itemsLocator, baseElement).then(function (items) {
                var promiseList = [],
                    data = [];

                _.each(items, function (arrItem) {
                    var promise = itemObj.collect(arrItem).then(function (value) {
                        if (value) {
                            data.push(value);
                        }
                    });

                    promiseList.push(promise);
                });

                return nemo.wd.promise.all(promiseList).then(function () {
                    base._clearBase(true);
                    if (!_.isEmpty(data)) {
                        return data;
                    }
                });
            });
        },

        item: function (itemIndex, baseOverride) {
            var baseElement;

            if (baseOverride) {
                baseElement = baseOverride;
            } else {
                baseElement = base._getBase();
            }

            return drivex.finds(itemsLocator, baseElement).then(function (items) {
                var getItemObj = itemModel(config, null, nemo, drivex),
                    item = items[itemIndex];

                // Override _getBase to always return the item retrieved here
                getItemObj._getBase = function () {
                    return item;
                }

                // Also override getElement in case it's an element type. This will let the rest of the functions work correctly.
                getItemObj.get = function () {
                    return item;
                }

                return getItemObj;
            })
        }
    });

    return base;
};

module.exports = ArrayModel;