'use strict';

var BaseModel = require('./base'),
    StaticItemModel = require('./staticItem'),
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

        if (itemModel.isAbstract) {
            throw new Error('[nemo-page] Cannot create models that are abstract');
        }
    } else {
        itemModel = mappings.element;
    }

    itemObj = itemModel(config, undefined, nemo, drivex);

    // Extend the base model with this models functions
    _.extend(base, {
        collect: function (baseOverride) {
            var baseElement;

            if (baseOverride) {
                baseElement = baseOverride;
            } else {
                baseElement = base.getBase();
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
                baseElement = base.getBase();
            }

            itemPromise = new nemo.wd.WebElementPromise(nemo.driver, drivex.finds(itemsLocator, baseElement).then(function (items) {
                return items[itemIndex];
            }));

            arrayItem = StaticItemModel(itemPromise, nemo);

            return itemModel(config, arrayItem, nemo, drivex);
        },

        isPresent: function (baseOverride) {
            if (baseOverride) {
                return drivex.present(itemsLocator, baseOverride);
            } else {
                return base.isBasePresent().then(function (isPresent) {
                    var baseElement;
                    if (isPresent) {
                        baseElement = base.getBase();
                        return drivex.present(itemsLocator, baseElement);
                    } else {
                        return false;
                    }
                });
            }
        },

        waitForPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return base.isPresent(baseElement).catch(function () {
                    return false;
                });
            }, nemo.page.WAIT_TIMEOUT);
        },

        waitForNotPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return base.isPresent(baseElement).then(function (isPresent) {
                    return !isPresent;
                }).catch(function () {
                    return false;
                });
            }, nemo.page.WAIT_TIMEOUT);
        },

        waitForDisplayed: function (baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.item(0).getBase().isDisplayed().catch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
            });
        },

        waitForNotDisplayed: function (baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.item(0).getBase().isDisplayed().then(function (isDisplayed) {
                        return !isDisplayed;
                    }).catch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
            });
        }
    });

    return base;
};

module.exports = ArrayModel;