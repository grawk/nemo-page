'use strict';

var debug = require('debug'),
    log = debug('nemo-page:log');

var ArrayItemModel = function (element, nemo) {
    log('ArrayItemModel: Initializing Array Item Model');

    return {
        _clearBase: function (isRecursive) {
            // Do nothing
        },

        getBase: function (cache) {
            return element;
        },

        isBasePresent: function () {
            var deferred = nemo.wd.promise.defer();

            deferred.fulfill(true);
            return deferred;
        }
    };
};

module.exports = ArrayItemModel;