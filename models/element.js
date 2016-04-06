'use strict';

var BaseModel = require('./base'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

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

        withClass: function (className) {
            var withClassConfig = _.clone(config);

            withClassConfig.locator = config.locator + '.' + className;
            withClassConfig.type = 'css';

            return ElementModel(withClassConfig, parent, nemo, drivex);
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
            return nemo.page.doOperationWithRetry(function () {
                return base.get(baseOverride).click();
            }, nemo.page.NUM_RETRIES);
        },

        hover: function (baseOverride) {
            return nemo.page.doOperationWithRetry(function () {
                var element = base.get(baseOverride);
                return nemo.driver.actions()
                        .mouseMove(element)
                        .perform();
            }, nemo.page.NUM_RETRIES);
        },

        dragAndDropTo: function (dropItem) {
            return nemo.page.doOperationWithRetry(function () {
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
            }, nemo.page.NUM_RETRIES);
        },

        isPresent: function (baseOverride) {
            return nemo.page.doOperationWithRetry(function () {
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
            }, nemo.page.NUM_RETRIES);
        },

        isDisplayed: function (baseOverride) {
            return nemo.page.doOperationWithRetry(function () {
                return base.isPresent(baseOverride).then(function (isPresent) {
                    if (isPresent) {
                        return base.get(baseOverride).isDisplayed();
                    } else {
                        return false;
                    }
                });
            }, nemo.page.NUM_RETRIES);
        },

        isEnabled: function (baseOverride) {
            return nemo.page.doOperationWithRetry(function () {
                return base.get(baseOverride).isEnabled();
            }, nemo.page.NUM_RETRIES);
        },

        waitForPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return base.isPresent(baseElement).then(function (isPresent) {
                    return isPresent;
                }).thenCatch(function (err) {
                    return false;
                });
            }, nemo.page.WAIT_TIMEOUT);
        },

        waitForNotPresent: function (baseElement) {
            return nemo.driver.wait(function () {
                return base.isPresent(baseElement).then(function (isPresent) {
                    return !isPresent;
                }).thenCatch(function () {
                    return false;
                });
            }, nemo.page.WAIT_TIMEOUT);
        },

        waitForDisplayed: function (baseElement) {
            base.waitForPresent(baseElement);
            return nemo.driver.wait(function () {
                return base.get(baseElement).isDisplayed().thenCatch(function (err) {
                    return false;
                });
            }, nemo.page.WAIT_TIMEOUT);
        },

        waitForNotDisplayed: function (baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).isDisplayed().then(function (isDisplayed) {
                        return !isDisplayed;
                    }).thenCatch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
            });
        },

        waitForTextExists: function (baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getText().then(function (value) {
                        return !!value;
                    }).thenCatch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
            });
        },

        waitForTextEqual: function (text, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getText().then(function (value) {
                        return value == text;
                    }).thenCatch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
            });
        },

        waitForTextNotEqual: function (text, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getText().then(function (value) {
                        return value != text;
                    }).thenCatch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
            });
        },

        waitForAttributeEqual: function (attribute, text, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getAttribute(attribute).then(function (value) {
                        return value == text;
                    }).thenCatch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
            });
        },

        waitForAttributeNotEqual: function (attribute, text, baseElement) {
            return base.waitForPresent(baseElement).then(function () {
                return nemo.driver.wait(function () {
                    return base.get(baseElement).getAttribute(attribute).then(function (value) {
                        return value != text;
                    }).thenCatch(function () {
                        return false;
                    });
                }, nemo.page.WAIT_TIMEOUT);
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
                    return nemo.page.doOperationWithRetry(function () {
                        return base.get(baseOverride).getText().then(function (value) {
                            if (_.isString(value)) {
                                value = value.trim();
                            }

                            return value;
                        });
                    }, nemo.page.NUM_RETRIES);
                }
            });
        },

        attributeCollect: function (attribute, baseOverride) {
            return base.isPresent(baseOverride).then(function (isPresent) {
                if (isPresent) {
                    return nemo.page.doOperationWithRetry(function () {
                        return base.get(baseOverride).getAttribute(attribute).then(function (value) {
                            if (_.isString(value)) {
                                value = value.trim();
                            }

                            return value;
                        });
                    }, nemo.page.NUM_RETRIES);
                }
            });
        },

        htmlCollect: function (baseOverride) {
            return base.isPresent(baseOverride).then(function (isPresent) {
                if (isPresent) {
                    return nemo.page.doOperationWithRetry(function () {
                        return base.get(baseOverride).getInnerHtml().then(function (value) {
                            if (_.isString(value)) {
                                value = value.trim();
                            }

                            return value;
                        });
                    }, nemo.page.NUM_RETRIES);
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