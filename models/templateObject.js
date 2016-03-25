'use strict';

var BaseModel = require('./base'),
    StaticItemModel = require('./staticItem'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

var WAIT_TIMEOUT = 8000;

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
            var baseElement;

            if (baseOverride) {
                baseElement = baseOverride;
            } else {
                baseElement = base._getBase(true);
            }

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
                baseElement = base._getBase();
            }

            itemPromise = new nemo.wd.WebElementPromise(nemo.driver, drivex.find(itemLocator, baseElement));

            staticItem = StaticItemModel(itemPromise, nemo);

            return itemModel(config, staticItem, nemo, drivex);
        },

        waitForPresent: function (data, baseElement) {
            var itemLocator = getItemLocator(data);

            return nemo.driver.wait(function () {
                return drivex.present(itemLocator, baseElement);
            }, WAIT_TIMEOUT);
        },

        waitForNotPresent: function (data, baseElement) {
            var itemLocator = getItemLocator(data);

            return nemo.driver.wait(function () {
                return drivex.present(itemLocator, baseElement).then(function (isPresent) {
                    return !isPresent;
                });
            }, WAIT_TIMEOUT);
        },

        waitForDisplayed: function (data, baseElement) {
            var itemLocator = getItemLocator(data);

            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return drivex.find(itemLocator, baseElement).isDisplayed();
                }, WAIT_TIMEOUT);
            });
        },

        waitForNotDisplayed: function (data, baseElement) {
            var itemLocator = getItemLocator(data);

            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return drivex.find(itemLocator, baseElement).isDisplayed().then(function (isDisplayed) {
                        return !isDisplayed;
                    });
                }, WAIT_TIMEOUT);
            });
        }
    });

    return base;
};

module.exports = TemplateObjectModel;