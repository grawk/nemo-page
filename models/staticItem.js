'use strict';

var debug = require('debug'),
    log = debug('nemo-page:log');

var ArrayItemModel = function (element) {
    log('ArrayItemModel: Initializing Array Item Model');

    return {
        _clearBase: function (isRecursive) {
            // Do nothing
        },

        _getBase: function (cache) {
            return element;
        }
    };
};

module.exports = ArrayItemModel;