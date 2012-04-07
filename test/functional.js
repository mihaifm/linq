var module = QUnit.module;
var Enumerable = require('../linq');

module("Functional");

test("Let", function ()
{
    var sum = Enumerable.Range(1, 10)
        .Let(function (e)
        {
            return e.Zip(e, function (a, b) { return { a: a, b: b} });
        })
        .Select("$.a + $.b")
        .Sum();
    equal(sum, 110);
});

test("Share", function ()
{
    var share = Enumerable.Range(1, 10).Share();
    var ar1 = share.Take(4).ToArray();
    var ar2 = share.ToArray();
    var ar3 = share.ToArray();
    deepEqual(ar1, [1, 2, 3, 4]);
    deepEqual(ar2, [5, 6, 7, 8, 9, 10]);
    deepEqual(ar3, []);
});

test("MemoizeAll", function ()
{
    var count = 0;
    var mem = Enumerable.Range(1, 5)
        .Select(function (x) { count++; return x; })
        .MemoizeAll();
    var ar1 = mem.ToArray();
    var ar2 = mem.ToArray();
    deepEqual(ar1, [1, 2, 3, 4, 5]);
    deepEqual(ar2, [1, 2, 3, 4, 5]);
    equal(5, count);

    mem = Enumerable.From([1, 2, undefined, 3, 4])
        .MemoizeAll();

    ar1 = mem.ToArray();
    ar2 = mem.ToArray();
    deepEqual(ar1, [1, 2, undefined, 3, 4]);
    deepEqual(ar2, [1, 2, undefined, 3, 4]);
});