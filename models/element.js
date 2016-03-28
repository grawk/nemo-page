'use strict';

var BaseModel = require('./base'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

var WAIT_TIMEOUT = 8000;

var ElementModel = function (config, parent, nemo, drivex) {
    log('ElementModel: Initializing Element Model');

    var locator,
        dataCollect = 'text',
        dataCollectCallArr = [];

    if (config.locator) {
        locator = normalize(nemo, config);
    }

    if (_.isString(config._data)) {
        dataCollectCallArr = config._data.split(':');
        dataCollect = dataCollectCallArr.shift();
    }

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
                baseElement = base.getBase();
            }

            if (locator) {
                return drivex.find(locator, baseElement);
            } else {
                return baseElement;
            }
        },

        click: function (baseOverride) {
            return base.get(baseOverride).click();
        },

        hover: function (baseOverride) {
            var element = base.get(baseOverride);
            return nemo.driver.actions()
                    .mouseMove(element)
                    .perform();
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
            var deferred;

            if (locator) {
                if (baseOverride) {
                    return drivex.present(locator, baseOverride);
                } else {
                    return base.isBasePresent().then(function (isPresent) {
                        var baseElement;
                        if (isPresent) {
                            baseElement = base.getBase();
                            return drivex.present(locator, baseElement).then(function (isPresent) {
                                return isPresent;
                            });
                        } else {
                            return false;
                        }
                    });
                }
            } else {
                if (baseOverride) {
                    deferred = nemo.wd.promise.defer();
                    deferred.fulfill(true);
                    return deferred;
                } else {
                    return base.isBasePresent();
                }
            }
        },

        isDisplayed: function (baseOverride) {
            return base.get(baseOverride).isDisplayed();
        },

        isEnabled: function (baseOverride) {
            return base.get(baseOverride).isEnabled();
        },

        waitForPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return base.isPresent(baseElement).then(function (isPresent) {
                    return isPresent;
                }).thenCatch(function (err) {
                    return false;
                });
            }, WAIT_TIMEOUT);
        },

        waitForNotPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return base.isPresent(baseElement).then(function (isPresent) {
                    return !isPresent;
                }).thenCatch(function (err) {
                    return false;
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
        },

        collect: function (baseOverride) {
            var callArr = _.clone(dataCollectCallArr);
            callArr.push(baseOverride);

            if (base[dataCollect + 'Collect']) {
                return base[dataCollect + 'Collect'].apply(null, callArr);
            } else {
                return base.textCollect.apply(null, callArr);
            }
        },

        /**
         * Collector functions only below
         */
        textCollect: function (baseOverride) {
            return base.isPresent(baseOverride).then(function (isPresent) {
                if (isPresent) {
                    return base.get(baseOverride).getText().then(function (value) {
                        if (_.isString(value)) {
                            value = value.trim();
                        }

                        return value;
                    });
                }
            });
        },

        attributeCollect: function (attribute, baseOverride) {
            return base.isPresent(baseOverride).then(function (isPresent) {
                if (isPresent) {
                    return base.get(baseOverride).getAttribute(attribute).then(function (value) {
                        if (_.isString(value)) {
                            value = value.trim();
                        }

                        return value;
                    });
                }
            });
        },

        htmlCollect: function (baseOverride) {
            return base.isPresent(baseOverride).then(function (isPresent) {
                if (isPresent) {
                    return base.get(baseOverride).getInnerHtml().then(function (value) {
                        if (_.isString(value)) {
                            value = value.trim();
                        }

                        return value;
                    });
                }
            });
        },

        presentCollect: function (baseOverride) {
            return base.isPresent(baseOverride);
        }
    });

    return base;
};

module.exports = ElementModel;