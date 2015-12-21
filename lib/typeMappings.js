'use strict';

var ObjectModel = require('../models/object');

var mappings = {
    // Abstract models
    base: require('../models/base'),
    element: require('../models/element'),

    // Instanceable models
    object: require('../models/object'),
    array: require('../models/array'),
    text: require('../models/text'),
    html: require('../models/html'),
    input: require('../models/input'),
    attribute: require('../models/attribute'),
    select: require('../models/select'),
    present: require('../models/present')
};

module.exports = {
    getMappings: function () {
        return mappings;
    },

    addMapping: function (key, model) {
        if (mappings[key]) {
            throw new Error('[nemo-page] An mapping for ' + key + ' already exists.');
        } else {
            mappings[key] = model;
        }
    }
};