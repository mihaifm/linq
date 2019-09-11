var module = QUnit.module;
var Enumerable = require('../linq');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("Iterator");

var actual, expected;

test("for..of", function () {
    actual = [];
    for (var a of Enumerable.from([1, 2, 3])) {
        actual.push(a);
    }
    deepEqual(actual, [1, 2, 3]);
});

test("Symbol.iterator", function ()
{
    actual = [1,2,3,4];
    expected = Array.from(Enumerable.from(actual));
    deepEqual(actual, expected);
    var actual2 = actual.map(function(x) { return x * 2 }); // [2,4,6,8];
    expected = Enumerable.from(actual).select(function(x) { return x * 2 });
    deepEqual(actual2, Array.from(expected));
});

test("from Iterable", function () {
    function* words() {
        yield "abc";
        yield "def";
    }

    deepEqual(Enumerable.from(words()).toArray(), ["abc", "def"]);

    actual = [];
    for (var a of Enumerable.from(words())) {
        actual.push(a);
    }
    deepEqual(actual, ["abc", "def"]);
});
