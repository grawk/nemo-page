'use strict';

var ElementModel = require('./element'),
    ArrayModel = require('./array'),
    StaticItemModel = require('./staticItem'),
    _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-page:log'),
    normalize = require('../lib/normalize');

var SelectModel = function (config, parent, nemo, drivex) {
    log('SelectModel: Initializing Select Model');

    config = _.defaults(_.clone(config), { '_data': 'attribute:value' });

    // Initialize the base model object
    var base = ElementModel(config, parent, nemo, drivex);

    base.options = ArrayModel({
        _base: config.locator,
        _data: 'attribute:value',
        _itemsLocator: {
            locator: 'option',
            type: 'css'
        }
    }, base, nemo, drivex);

    // Extend the base model with this models functions
    _.extend(base, {
        option: function (data, baseOverride) {
            var element = base.get(baseOverride),
                optionLoc,
                itemPromise,
                item;

            if (_.isNumber(data)) {
                optionLoc = normalize(nemo, {
                    locator: 'option:nth-child(' + data + ')',
                    type: 'css'
                });
            } else {
                optionLoc = normalize(nemo, {
                    locator: 'option[value="' + data + '"]',
                    type: 'css'
                });
            }

            itemPromise = new nemo.wd.WebElementPromise(nemo.driver, drivex.find(optionLoc, element));
            item = StaticItemModel(itemPromise, nemo);

            return ElementModel({ '_data': 'attribute:value'}, item, nemo, drivex);
        },

        setValue: function (data, baseOverride) {
            return base.option(data, baseOverride).click();
        }
    });

    return base;
};

module.exports = SelectModel;