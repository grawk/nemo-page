'use strict';

var BaseModel = require('./base'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

var WAIT_TIMEOUT = 8000;

var ElementModel = function (config, parent, nemo, drivex) {
    log('ElementModel: Initializing Element Model');

    var locator = normalize(nemo, config);

    // Initialize the base model object
    var base = BaseModel(config, parent, nemo, drivex);

    // Extend the base model with this models functions
    _.extend(base, {
        locator: function () {
            return locator;
        },

        get: function (baseOverride) {
            var baseElement;

            if (baseOverride) {
                baseElement = baseOverride;
            } else {
                baseElement = base._getBase();
            }

            return drivex.find(locator, baseElement);
        },

        click: function (baseOverride) {
            return base.get(baseOverride).click();
        },

        dragAndDropTo: function (dropItem) {
            var dragElement = base.get(),
                dropElement = dropItem.get();

            dragElement.click();
            dropElement.click();

            return dropElement.getLocation().then(function (loc) {
                return dropElement.getSize().then(function (size) {
                    var dragOffset = {
                            x: 15,
                            y: 15
                        },
                        dropOffset = {
                            x: 15,
                            y: size.height / 2
                        };

                    nemo.driver.actions()
                        .mouseMove(dragElement)
                        .mouseDown()
                        .mouseMove(dragElement, dragOffset)
                        .mouseMove(dropElement, dropOffset)
                        .perform();

                    nemo.driver.sleep(500);

                    return nemo.driver.actions()
                        .mouseUp()
                        .perform();
                });
            });
        },

        isPresent: function (baseOverride) {
            var baseElement;

            if (baseOverride) {
                baseElement = baseOverride;
            } else {
                baseElement = base._getBase();
            }

            return drivex.present(locator, baseElement);
        },

        isDisplayed: function (baseOverride) {
            return base.get(baseOverride).isDisplayed();
        },

        isEnabled: function (baseOverride) {
            return base.get(baseOverride).isEnabled();
        },

        waitForPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return drivex.present(locator, baseElement);
            }, WAIT_TIMEOUT);
        },

        waitForNotPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return drivex.present(locator, baseElement).then(function (isPresent) {
                    return !isPresent;
                });
            }, WAIT_TIMEOUT);
        },

        waitForDisplayed: function (baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).isDisplayed();
                }, WAIT_TIMEOUT);
            });
        },

        waitForNotDisplayed: function (baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).isDisplayed().then(function (isDisplayed) {
                        return !isDisplayed;
                    });
                }, WAIT_TIMEOUT);
            });
        },

        waitForTextExists: function (baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getText().then(function (value) {
                        return !!value;
                    });
                }, WAIT_TIMEOUT);
            });
        },

        waitForTextEqual: function (text, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getText().then(function (value) {
                        return value == text;
                    });
                }, WAIT_TIMEOUT);
            });
        },

        waitForTextNotEqual: function (text, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getText().then(function (value) {
                        return value != text;
                    });
                }, WAIT_TIMEOUT);
            });
        },

        waitForAttributeEqual: function (attribute, text, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getAttribute(attribute).then(function (value) {
                        return value == text;
                    });
                }, WAIT_TIMEOUT);
            });
        },

        waitForAttributeNotEqual: function (attribute, text, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getAttribute(attribute).then(function (value) {
                        return value != text;
                    });
                }, WAIT_TIMEOUT);
            });
        }
    });

    return base;
};

ElementModel.isAbstract = true;

module.exports = ElementModel;