'use strict';

var ElementModel = require('./element'),
    ArrayModel = require('./array'),
    StaticItemModel = require('./staticItem'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

var RadioModel = function (config, parent, nemo, drivex) {
    log('RadioModel: Initializing Radio Model');

    config = _.defaults(_.clone(config), { '_data': 'checked' });

    // Initialize the base model object
    var base = ElementModel(config, parent, nemo, drivex);

    base.options = ArrayModel({
        _data: 'attribute:value',
        _itemsLocator: {
            locator: config.locator,
            type: config.type
        }
    }, base, nemo, drivex);

    // Extend the base model with this models functions
    _.extend(base, {
        option: function (data, baseOverride) {
            if (_.isNumber(data)) {
                return base.options(data);
            } else {
                var baseElement = baseOverride || base.getBase(),
                    elementPromise,
                    itemPromise,
                    item;

                elementPromise = nemo.page.doOperationWithRetry(function () {
                    return drivex.finds(base.locator(), baseElement).then(function (elements) {
                        function checkElementValue (index) {
                            if (elements[index]) {
                                return elements[index].getAttribute('value').then(function (value) {
                                    if (value === data) {
                                        return elements[index];
                                    } else {
                                        return checkElementValue(index + 1);
                                    }
                                });
                            } else {
                                throw new Error('No radio with value "' + data + '" was found');
                            }
                        }

                        return checkElementValue(0);
                    });
                }, nemo.page.NUM_RETRIES);
                itemPromise = new nemo.wd.WebElementPromise(nemo.driver, elementPromise);
                item = StaticItemModel(itemPromise, nemo);

                return ElementModel({ '_data': 'attribute:value'}, item, nemo, drivex);
            }
        },

        setValue: function (data, baseOverride) {
            return base.option(data, baseOverride).click();
        },

        checkedCollect: function (baseOverride) {
            return nemo.page.doOperationWithRetry(function () {
                var baseElement = baseOverride || base.getBase();

                return drivex.finds(base.locator(), baseElement).then(function (elements) {
                    function checkElementIsChecked (index) {
                        if (elements[index]) {
                            return elements[index].getAttribute('checked').then(function (value) {
                                if (value) {
                                    return elements[index].getAttribute('value');
                                } else {
                                    return checkElementIsChecked(index + 1);
                                }
                            });
                        } else {
                            return undefined;
                        }
                    }

                    return checkElementIsChecked(0);
                });
            }, nemo.page.NUM_RETRIES);
        }
    });

    return base;
};

module.exports = RadioModel;