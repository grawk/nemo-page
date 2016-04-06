'use strict';

var _ = require('lodash');

var defaultMappings = {
        // Abstract models
        base: require('../models/base'),
        element: require('../models/element'),

        // Instanceable models
        object: require('../models/object'),
        templateObject: require('../models/templateObject'),
        array: require('../models/array'),
        input: require('../models/input'),
        select: require('../models/select'),
        radio: require('../models/radio')
    },
    mappings = _.clone(defaultMappings);

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
    },

    resetMappings: function () {
        mappings = _.clone(defaultMappings);
    }
};