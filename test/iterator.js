var module = QUnit.module;
var Enumerable = require('../linq');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

if (Enumerable.Utils.hasNativeIteratorSupport()) {

    module("Iterator");

    var actual, expected;

    test("for..of", function ()
    {
        actual = [1,2,3,4];
        expected = Array.from(Enumerable.from(actual));
        deepEqual(actual, expected);
        var actual2 = actual.map(function(x) { return x * 2 }); // [2,4,6,8];
        expected = Enumerable.from(actual).select(function(x) { return x * 2 });
        deepEqual(actual2, Array.from(expected));
    });

}