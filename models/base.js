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
            var parentBase;

            if (baseLocator) {
                if (parent && parent.getBase) {
                    parentBase = parent.getBase();
                }

                return drivex.present(baseLocator, parentBase);
            } else {
                return parent.isBasePresent();
            }
        }
    };
};

BaseModel.isAbstract = true;

module.exports = BaseModel;