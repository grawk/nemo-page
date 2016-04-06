'use strict';

var debug = require('debug'),
    log = debug('nemo-page:log');

var ArrayItemModel = function (element, nemo) {
    log('ArrayItemModel: Initializing Array Item Model');

    return {
        getBase: function (cache) {
            return element;
        },

        get: function () {
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