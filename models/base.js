'use strict';

var _ = require('lodash'),
    normalize = require('../lib/normalize');

var BaseModel = function(config, parent, nemo, drivex) {
    var baseLocator,
        base;

    if (config['_base']) {
        baseLocator = normalize(nemo, config['_base']);
    }

    return {
        _clearBase: function (isRecursive) {
            base = undefined;

            if (isRecursive && parent && parent.clearBase) {
                parent.clearBase(isRecursive);
            }
        },

        getBase: function (cache) {
            var parentBase,
                foundBase;

            if (base) {
                return base;
            }

            if (parent && parent.getBase) {
                parentBase = parent.getBase();
            }

            if (baseLocator) {
                foundBase = drivex.find(baseLocator, parentBase);
                if (cache) {
                    base = foundBase;
                }

                return foundBase;
            } else {
                return parentBase;
            }
        },

        isBasePresent: function () {
            var deferred;

            if (baseLocator) {
                if (parent && parent.getBase) {
                    return parent.isBasePresent().then(function (isPresent) {
                        if (isPresent) {
                            return drivex.present(baseLocator, parent.getBase());
                        } else {
                            return false;
                        }
                    });
                } else {
                    return drivex.present(baseLocator);
                }
            } else if (parent && parent.isBasePresent) {
                return parent.isBasePresent();
            } else {
                deferred = nemo.wd.promise.defer();

                deferred.fulfill(true);
                return deferred;
            }
        }
    };
};

BaseModel.isAbstract = true;

module.exports = BaseModel;