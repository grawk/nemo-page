'use strict';

var Nemo = require('nemo'),
    assert = require('assert');

var nemo;

/**
 * NOTE: These are example tests to show you how to use some of the functionality.
 * There is nothing in place right now to actually run these.
 */

describe('Example Tests!', function () {
    before(function (done) {
        nemo = Nemo(done);
    });

    after(function (done) {
        nemo.driver.quit().then(done);
    });

    it('Collect all the information from the page', function () {
        nemo.driver.get(nemo.data.baseUrl);
        nemo.page.example.collect().then (function (data) {
            /*
             * data:
             * {
             *     form: {
             *         input1: "hi"
             *         input2: "low"
             *     },
             *     list: [{
             *         part1: "1part1",
             *         part2: "1part2"
             *     }, {
             *         part1: "2part1",
             *         part2: "2part2"
             *     }],
             *     attr: "my-attr"
             * }
             */
        });
    });

    it('Set the form values', function () {
        nemo.driver.get(nemo.data.baseUrl);

        nemo.page.example.form.setValue({
            input1: "value1",
            input2: "value2"
        });

        nemo.page.example.form.collect().then (function (data) {
            /*
             * data:
             * {
             *     input1: "value1"
             *     input2: "value2"
             * }
             */
        });
    });
})