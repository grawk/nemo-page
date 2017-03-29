'use strict';

var _ = require('lodash'),
    normalize = require('../lib/normalize');

var BaseModel = function(config, parent, nemo, drivex) {
    var baseLocator;

    if (config['_base']) {
        baseLocator = normalize(nemo, config['_base']);
    }

    var base = {
        getBase: function () {
            var parentBase;

            if (parent && parent.getBase) {
                parentBase = parent.getBase();
            }

            if (baseLocator) {
                return drivex.find(baseLocator, parentBase);
            } else {
                return parentBase;
            }
        },

        get: function () {
            return base.getBase();
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
                return deferred.promise;
            }
        }
    };

    return base;
};

BaseModel.isAbstract = true;

module.exports = BaseModel;