var module = QUnit.module;
var Enumerable = require('../linq');

module("Ordering");

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

test("OrderBy", function ()
{
    actual = Enumerable.From([1, 51, 7, 823, 85, 31, 51, 99])
        .OrderBy("i=>i")
        .ToArray();
    deepEqual(actual, [1, 7, 31, 51, 51, 85, 99, 823]);
});

test("OrderByDescending", function ()
{
    actual = Enumerable.From([1, 51, 7, 823, 85, 31, 51, 99])
        .OrderByDescending("i=>i")
        .ToArray();
    deepEqual(actual, [823, 99, 85, 51, 51, 31, 7, 1]);
});

test("ThenBy", function ()
{
    actual = Enumerable.From(list)
        .OrderBy("l=>l.a")
        .ThenBy("l=>l.b")
        .ThenBy("l=>l.c")
        .ToArray();
    expected = [
        { a: 2, b: 3, c: 7 },
        { a: 2, b: 4, c: 1 },
        { a: 4, b: 4, c: 3 },
        { a: 4, b: 4, c: 5 },
        { a: 6, b: 6, c: 3 },
        { a: 7, b: 3, c: 2 }
    ];
    deepEqual(actual, expected);

    actual = Enumerable.From(strlist)
        .OrderBy("l=>l.a")
        .ThenBy("l=>l.b")
        .ThenBy("l=>l.c")
        .ToArray();
    expected = [
        { a: "a", b: "c", c: "k" },
        { a: "a", b: "z", c: "b" },
        { a: "n", b: "d", c: "o" },
        { a: "n", b: "d", c: "q" },
        { a: "z", b: "e", c: "e" }
    ];
    deepEqual(actual, expected);
});

test("ThenByDescending", function ()
{
    actual = Enumerable.From(list)
        .OrderByDescending("l=>l.a")
        .ThenByDescending("l=>l.b")
        .ThenByDescending("l=>l.c")
        .ToArray();
    expected = [
        { a: 7, b: 3, c: 2 },
        { a: 6, b: 6, c: 3 },
        { a: 4, b: 4, c: 5 },
        { a: 4, b: 4, c: 3 },
        { a: 2, b: 4, c: 1 },
        { a: 2, b: 3, c: 7 }
    ];
    deepEqual(actual, expected);

    actual = Enumerable.From(strlist)
        .OrderByDescending("l=>l.a")
        .ThenByDescending("l=>l.b")
        .ThenByDescending("l=>l.c")
        .ToArray();
    expected = [
        { a: "z", b: "e", c: "e" },
        { a: "n", b: "d", c: "q" },
        { a: "n", b: "d", c: "o" },
        { a: "a", b: "z", c: "b" },
        { a: "a", b: "c", c: "k" }
    ];
    deepEqual(actual, expected);
});

test("Reverse", function ()
{
    actual = Enumerable.From([1, 51, 7, 823, 85, 31, 51, 99])
        .Reverse()
        .ToArray();
    deepEqual(actual, [99, 51, 31, 85, 823, 7, 51, 1]);
});

test("Shuffle", function ()
{
    var array = [1, 51, 7, 823, 85, 31, 51, 99];
    var shuffled = Enumerable.From(array).Shuffle().ToArray();
    notDeepEqual(shuffled, array, "random test. if failed retry");
});