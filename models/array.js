'use strict';

var BaseModel = require('./base'),
    ArrayItemModel = require('./arrayItem'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

var WAIT_TIMEOUT = 8000;

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

        if (itemModel.isAbstract) {
            throw new Error('[nemo-page] Cannot create models that are abstract');
        }
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
            var baseElement,
                arrayItem,
                itemPromise;

            if (baseOverride) {
                baseElement = baseOverride;
            } else {
                baseElement = base._getBase();
            }

            itemPromise = new nemo.wd.WebElementPromise(nemo.driver, drivex.finds(itemsLocator, baseElement).then(function (items) {
                return items[itemIndex];
            }));

            arrayItem = ArrayItemModel(itemPromise);

            return itemModel(config, arrayItem, nemo, drivex);
        },

        waitForPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return drivex.present(itemsLocator, baseElement);
            }, WAIT_TIMEOUT);
        },

        waitForNotPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return drivex.present(itemsLocator, baseElement).then(function (isPresent) {
                    return !isPresent;
                });
            }, WAIT_TIMEOUT);
        },

        waitForDisplayed: function (baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return drivex.find(itemsLocator, baseElement).isDisplayed();
                }, WAIT_TIMEOUT);
            });
        },

        waitForNotDisplayed: function (baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return drivex.find(itemsLocator, baseElement).isDisplayed().then(function (isDisplayed) {
                        return !isDisplayed;
                    });
                }, WAIT_TIMEOUT);
            });
        },
    });

    return base;
};

module.exports = ArrayModel;