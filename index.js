'use strict';

var _ = require('lodash'),
    debug = require('debug'),
    log = debug('nemo-view:log'),
    error = debug('nemo-view:error'),
    glob = require("glob"),
    path = require('path'),
    typeMappings = require('./lib/typeMappings'),
    Drivex = require('selenium-drivex');

module.exports.typeMappings = typeMappings;

module.exports.setup = function (locatorDirectory, modelDirectory, nemo, _callback) {
    log('Initializing nemo-page');
    var callback = _.once(_callback),
        drivex = Drivex(nemo.driver, nemo.wd);

    // Add page namespace to nemo
    nemo.page = {};

    if (modelDirectory !== null) {
        typeMappings.resetMappings();
        glob("**/*.js", { cwd: modelDirectory }, function (err, files) {
            log('Starting to process models:', files);
            _.each(files, function (file) {
                var fileObj = require(path.resolve(modelDirectory, file)),
                    modelPathArray = file.split('/'),
                    fileName = modelPathArray[modelPathArray.length - 1].split('.js')[0];

                try {
                    log('Attempting to process model ' + fileName);
                    typeMappings.addMapping(fileName, fileObj);
                } catch (err) {
                    error(err);
                    callback(err);
                }
            });
        });
    }

    // Get all the files in the locator directory and sub-directories
    if (locatorDirectory !== null) {
        glob("**/*.json", { cwd: locatorDirectory }, function (err, files) {
            log('Starting to process locators:', files);
            _.each(files, function (file) {
                var fileObj = require(path.resolve(locatorDirectory, file)),
                    viewPathArray = file.split('/'),
                    fileName = viewPathArray[viewPathArray.length - 1].split('.json')[0];

                try {
                    log('Attempting to process locator ' + fileName);
                    nemo.page[fileName] = typeMappings.getMappings().object(fileObj, undefined, nemo, drivex);
                } catch (err) {
                    error(err);
                    callback(err);
                }
            });
            callback(null);
        });
    } else {
        callback(null);
    }
};