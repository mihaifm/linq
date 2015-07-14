var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("Action");

var expected, actual; // will be removed

test("doAction", function ()
{
    var array = [];
    actual = Enumerable.range(1, 10).doAction(function (i) { array.push(i) }).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    array = []
    var array2 = []
    actual = Enumerable.range(1, 10).doAction(function (v, i) { array.push(v); array2.push(i); }).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    deepEqual(actual, array);
    deepEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], array2);
});

test("forEach", function ()
{
    actual = [];
    Enumerable.range(1, 10).forEach(function (i) { actual.push(i) });
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    actual = [];
    var actual2 = [];
    Enumerable.range(1, 10).forEach(function (v, i) { actual.push(v); actual2.push(i); });
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    deepEqual(actual2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    actual = [];
    Enumerable.range(1, 10).forEach(function (i) { if (i == 5) return false; actual.push(i); });
    deepEqual(actual, [1, 2, 3, 4]);

    actual = [];
    actual2 = [];
    Enumerable.range(1, 10).forEach(function (v, i) { if (i == 5) return false; actual.push(v); actual2.push(i); });
    deepEqual(actual, [1, 2, 3, 4, 5]);
    deepEqual(actual2, [0, 1, 2, 3, 4]);
});

test("force", function ()
{
    var actual = [];
    Enumerable.range(1, 10).doAction(function (i) { actual.push(i) }).force();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});
