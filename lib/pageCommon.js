'use strict';

module.exports = function (nemo, drivex) {
    var common = {
        WAIT_TIMEOUT: 8000, // Wait operation timeout in ms
        NUM_RETRIES: 2, // How many times to retry an operation

        doOperationWithRetry: function (operation, retriesLeft) {
            return operation().catch(function (err) {
                if (retriesLeft > 0) {
                    console.log('I am retrying standard!', retriesLeft);
                    return nemo.driver.sleep(100).then(function() {
                        return common.doOperationWithRetry(operation, retriesLeft - 1);
                    })

                } else {
                    throw err;
                }
            });
        }
    };

    return common;
};