'use strict';

var BaseModel = require('./base'),
    StaticItemModel = require('./staticItem'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

var TemplateObjectModel = function (config, parent, nemo, drivex) {
    log('TemplateObjectModel: Initializing Array Model');

    // Initialize the base model object
    var mappings = require('../lib/typeMappings').getMappings(),
        base = BaseModel(config, parent, nemo, drivex),
        itemsLocatorTemplate = _.template(config['_locatorTemplate'].locator),
        itemsLocatorType = config['_locatorTemplate'].type,
        itemModel,
        itemObj;

    var getItemLocator = function (data) {
        return normalize(nemo, {
            locator: itemsLocatorTemplate(data),
            type: itemsLocatorType
        });
    };

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
        collectItem: function (data, baseOverride) {
            return base.item(data, baseOverride).collect();
        },

        item: function (data, baseOverride) {
            var itemLocator = getItemLocator(data),
                baseElement,
                staticItem,
                itemPromise;

            if (baseOverride) {
                baseElement = baseOverride;
            } else {
                baseElement = base.getBase();
            }

            itemPromise = new nemo.wd.WebElementPromise(nemo.driver, drivex.find(itemLocator, baseElement));

            staticItem = StaticItemModel(itemPromise, nemo);

            return itemModel(config, staticItem, nemo, drivex);
        },

        isPresent: function (data, baseOverride) {
            var itemLocator = getItemLocator(data);

            if (baseOverride) {
                return drivex.present(itemLocator, baseOverride);
            } else {
                return base.isBasePresent().then(function (isPresent) {
                    var baseElement;
                    if (isPresent) {
                        baseElement = base.getBase();
                        return drivex.present(itemLocator, baseElement).then(function (isPresent) {
                            return isPresent;
                        });
                    } else {
                        return false;
                    }
                });
            }
        },

        waitForPresent: function (data, baseElement) {
            return nemo.driver.wait(function () {
                return base.isPresent(data, baseElement).thenCatch(function () {
                    return false;
                });
            }, nemo.page.WAIT_TIMEOUT);
        },

        waitForNotPresent: function (data, baseElement) {
            return nemo.driver.wait(function () {
                return base.isPresent(data, baseElement).then(function (isPresent) {
                    return !isPresent;
                }).thenCatch(function () {
                    return false;
                });
            }, nemo.page.WAIT_TIMEOUT);
        },

        waitForDisplayed: function (data, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.item(data, baseElement).isDisplayed().thenCatch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
            });
        },

        waitForNotDisplayed: function (data, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.item(data, baseElement).isDisplayed().then(function (isDisplayed) {
                        return !isDisplayed;
                    }).thenCatch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
            });
        }
    });

    return base;
};

module.exports = TemplateObjectModel;