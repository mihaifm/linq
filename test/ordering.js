var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("Ordering");

var expected, actual; // will be removed

var list = [
    { a: 2, b: 4, c: 1 },
    { a: 2, b: 3, c: 7 },
    { a: 6, b: 6, c: 3 },
    { a: 4, b: 4, c: 5 },
    { a: 7, b: 3, c: 2 },
    { a: 4, b: 4, c: 3 }
];

var strlist = [
    { a: "a", b: "z", c: "b" },
    { a: "z", b: "e", c: "e" },
    { a: "n", b: "d", c: "q" },
    { a: "a", b: "c", c: "k" },
    { a: "n", b: "d", c: "o" }
];

test("orderBy", function () {
    actual = Enumerable.from([1, 51, 7, 823, 85, 31, 51, 99])
        .orderBy("i=>i")
        .toArray();
    deepEqual(actual, [1, 7, 31, 51, 51, 85, 99, 823]);

    Enumerable.rangeTo(10, 1).orderBy("$%5").is(10, 5, 6, 1, 7, 2, 8, 3, 9, 4);
});

test("orderByDescending", function () {
    actual = Enumerable.from([1, 51, 7, 823, 85, 31, 51, 99])
        .orderByDescending("i=>i")
        .toArray();
    deepEqual(actual, [823, 99, 85, 51, 51, 31, 7, 1]);

    Enumerable.rangeTo(1, 10).orderByDescending("$%5").is(4, 9, 3, 8, 2, 7, 1, 6, 5, 10);
});

test("thenBy", function () {
    actual = Enumerable.from(list)
        .orderBy("l=>l.a")
        .thenBy("l=>l.b")
        .thenBy("l=>l.c")
        .toArray();
    expected = [
        { a: 2, b: 3, c: 7 },
        { a: 2, b: 4, c: 1 },
        { a: 4, b: 4, c: 3 },
        { a: 4, b: 4, c: 5 },
        { a: 6, b: 6, c: 3 },
        { a: 7, b: 3, c: 2 }
    ];
    deepEqual(actual, expected);

    actual = Enumerable.from(strlist)
        .orderBy("l=>l.a")
        .thenBy("l=>l.b")
        .thenBy("l=>l.c")
        .toArray();
    expected = [
        { a: "a", b: "c", c: "k" },
        { a: "a", b: "z", c: "b" },
        { a: "n", b: "d", c: "o" },
        { a: "n", b: "d", c: "q" },
        { a: "z", b: "e", c: "e" }
    ];
    deepEqual(actual, expected);
});

test("thenByDescending", function () {
    actual = Enumerable.from(list)
        .orderByDescending("l=>l.a")
        .thenByDescending("l=>l.b")
        .thenByDescending("l=>l.c")
        .toArray();
    expected = [
        { a: 7, b: 3, c: 2 },
        { a: 6, b: 6, c: 3 },
        { a: 4, b: 4, c: 5 },
        { a: 4, b: 4, c: 3 },
        { a: 2, b: 4, c: 1 },
        { a: 2, b: 3, c: 7 }
    ];
    deepEqual(actual, expected);

    actual = Enumerable.from(strlist)
        .orderByDescending("l=>l.a")
        .thenByDescending("l=>l.b")
        .thenByDescending("l=>l.c")
        .toArray();
    expected = [
        { a: "z", b: "e", c: "e" },
        { a: "n", b: "d", c: "q" },
        { a: "n", b: "d", c: "o" },
        { a: "a", b: "z", c: "b" },
        { a: "a", b: "c", c: "k" }
    ];
    deepEqual(actual, expected);
});

test("reverse", function () {
    actual = Enumerable.from([1, 51, 7, 823, 85, 31, 51, 99])
        .reverse()
        .toArray();
    deepEqual(actual, [99, 51, 31, 85, 823, 7, 51, 1]);
});

test("shuffle", function () {
    var array = [1, 51, 7, 823, 85, 31, 51, 99];
    var shuffled = Enumerable.from(array).shuffle().toArray();
    notDeepEqual(shuffled, array, "random test. if failed retry");
});

test("weightedSample", function () {
    var result = [1, 25, 35, 39].weightedSample()
        .take(10000)
        .groupBy()
        .toObject("$.key()", "$.count()");

    result[1].is(function (x) { return 0 < x && x < 200 });
    result[25].is(function (x) { return 2300 < x && x < 2700 });
    result[35].is(function (x) { return 3300 < x && x < 3700 });
    result[39].is(function (x) { return 3700 < x && x < 4100 });

    Enumerable.from(result).sum(function (x) { return x.value }).is(10000);

    result = [1, 99].weightedSample().take(10000).groupBy().toObject("$.key()", "$.count()");
    result[1].is(function (x) { return 0 < x && x < 200 });
    result[99].is(function (x) { return 9800 < x && x < 10000 });

    result = [0, 1].weightedSample().take(10000).groupBy().toObject("$.key()", "$.count()");
    (result[0] === undefined).is(true);
    result[1].is(10000);
});
