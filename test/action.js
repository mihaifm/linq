var module = QUnit.module;
var Enumerable = require('../linq');

module("Action");

test("Do", function ()
{
    var array = []
    actual = Enumerable.Range(1, 10).Do(function (i) { array.push(i) }).ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    array = []
    var array2 = []
    actual = Enumerable.Range(1, 10).Do(function (v, i) { array.push(v); array2.push(i); }).ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    deepEqual(actual, array);
    deepEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], array2);
});

test("ForEach", function ()
{
    actual = [];
    Enumerable.Range(1, 10).ForEach(function (i) { actual.push(i) });
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    actual = [];
    var actual2 = [];
    Enumerable.Range(1, 10).ForEach(function (v, i) { actual.push(v); actual2.push(i); });
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    deepEqual(actual2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    actual = [];
    Enumerable.Range(1, 10).ForEach(function (i) { if (i == 5) return false; actual.push(i); });
    deepEqual(actual, [1, 2, 3, 4]);

    actual = [];
    actual2 = [];
    Enumerable.Range(1, 10).ForEach(function (v, i) { if (i == 5) return false; actual.push(v); actual2.push(i); });
    deepEqual(actual, [1, 2, 3, 4, 5]);
    deepEqual(actual2, [0, 1, 2, 3, 4]);
});

test("Force", function ()
{
    var actual = [];
    Enumerable.Range(1, 10).Do(function (i) { actual.push(i) }).Force();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});