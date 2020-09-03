var {test, testModule, deepEqual, notDeepEqual, ok, strictEqual} = require('./testutils.js')
var Enumerable = require('../linq.min');

testModule("Ordering");

var expected, actual;

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

    deepEqual(Enumerable.rangeTo(10, 1).orderBy("$%5").toArray(), [10, 5, 6, 1, 7, 2, 8, 3, 9, 4]);

    actual = ['b', 'a', 'd', 'c'];
    deepEqual(Enumerable.from(actual).orderBy().toArray(), ['a', 'b', 'c', 'd']);
    deepEqual(Enumerable.from(actual).orderBy(x=>x, "(x,y)=>x.localeCompare(y)").toArray(), ['a', 'b', 'c', 'd']);
    deepEqual(Enumerable.from(actual).orderBy(x=>x, (x,y)=>(x < y) ? 1 : (x == y) ? 0 : -1).toArray(), ['d', 'c', 'b', 'a']);
    deepEqual(Enumerable.from(actual).orderBy(x=>x, (x,y)=>(x < y) ? 1 : -1).toArray(), ['d', 'c', 'b', 'a']);
});

test("orderByDescending", function () {
    actual = Enumerable.from([1, 51, 7, 823, 85, 31, 51, 99])
        .orderByDescending("i=>i")
        .toArray();
    deepEqual(actual, [823, 99, 85, 51, 51, 31, 7, 1]);

    deepEqual(Enumerable.rangeTo(1, 10).orderByDescending("$%5").toArray(), [4, 9, 3, 8, 2, 7, 1, 6, 5, 10]);

    actual = ['b', 'a', 'd', 'c'];
    deepEqual(Enumerable.from(actual)
        .orderByDescending(x=>x, (x, y)=>x < y ? -1 : +(x > y)).toArray(), ['d', 'c', 'b', 'a']);
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

    actual = Enumerable.from(strlist)
        .orderBy(l=>l.a)
        .thenBy(l=>l, (x,y) => x.b < y.b ? -1 : x.b > y.b ? 1 : x.c < y.c ? -1 : +(x.c > y.c))
        .toArray();

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
    notDeepEqual(shuffled, array);
});

test("weightedSample", function () {
    var result = Enumerable.from([1, 25, 35, 39]).weightedSample()
        .take(10000)
        .groupBy()
        .toObject("$.key()", "$.count()");

    ok((function (x) { return 0 < x && x < 200 })(result[1]));
    ok((function (x) { return 2300 < x && x < 2700 })(result[25]));
    ok((function (x) { return 3300 < x && x < 3700 })(result[35]));
    ok((function (x) { return 3700 < x && x < 4100 })(result[39]));

    strictEqual(Enumerable.from(result).sum(function (x) { return x.value }), 10000);

    result = Enumerable.from([1, 99]).weightedSample().take(10000).groupBy().toObject("$.key()", "$.count()");
    ok((function (x) { return 0 < x && x < 200 })(result[1]));
    ok((function (x) { return 9800 < x && x < 10000 })(result[99]));

    result = Enumerable.from([0, 1]).weightedSample().take(10000).groupBy().toObject("$.key()", "$.count()");
    ok(result[0] === undefined);
    strictEqual(result[1], 10000);
});
