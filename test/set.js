var module = QUnit.module;
var Enumerable = require('../linq');

module("Set");

test("all", function ()
{
    var seq = Enumerable.range(1, 10);
    ok(!seq.all("i=>i%2==0"));
    ok(seq.all("i=>i<=10"));
});

test("any", function ()
{
    var seq = Enumerable.range(1, 10);
    var empty = Enumerable.empty();
    ok(seq.any());
    ok(!empty.any());
    ok(seq.any("$==5"));
    ok(!seq.any("$==100"));
});

test("concat", function ()
{
    actual = Enumerable.range(1, 3).concat([20, 21, 22]).toArray();
    deepEqual(actual, [1, 2, 3, 20, 21, 22]);
});

test("insert", function ()
{
    actual = Enumerable.range(1, 5).insert(3, [20, 21, 22]).toArray();
    deepEqual(actual, [1, 2, 3, 20, 21, 22, 4, 5]);
});

test("alternate", function ()
{
    actual = Enumerable.range(1, 5).alternate(2).toArray();
    deepEqual(actual, [1, 2, 2, 2, 3, 2, 4, 2, 5]);
    deepEqual(Enumerable.empty().alternate(2).toArray(), []);
    deepEqual(Enumerable.make(1).alternate(2).toArray(), [1]);
});

test("contains", function ()
{
    var seq = Enumerable.range(1, 10);
    ok(seq.contains(5));
    ok(!seq.contains(13));

    seq = Enumerable.range(1, 10).select("{test:$%2}");
    ok(seq.contains(1, "$.test"));
    ok(!seq.contains(3, "$.test"));
});

test("defaultIfEmpty", function ()
{
    actual = Enumerable.range(1, 10).defaultIfEmpty(199).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    actual = Enumerable.empty().defaultIfEmpty(199).toArray();
    deepEqual(actual, [199]);
});

test("distinct", function ()
{
    actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9]).distinct().toArray();
    deepEqual(actual, [1, 3, 5, 6, 4, 2, 9]);
    actual = Enumerable.range(1, 10).select("{test:$%2}").distinct("$.test").toArray();
    deepEqual(actual, [{ test: 1 }, { test: 0}]);
});

test("except", function ()
{
    actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9])
        .except([4, 6, 2, 7, 8, 10, 11])
        .toArray();
    deepEqual(actual, [1, 3, 5, 9]);
    actual = Enumerable.range(1, 10).select("{test:$%3}")
        .except(Enumerable.range(1, 10).select("{test:$%2}"), "$.test")
        .toArray();
    deepEqual(actual, [{ test: 2}]);
});

test("intersect", function ()
{
    actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9])
        .intersect([4, 6, 2, 7, 8, 10, 11])
        .toArray();
    deepEqual(actual, [6, 4, 2]);
    actual = Enumerable.range(1, 10).select("{test:$%3}")
        .intersect(Enumerable.range(1, 10).select("{test:$%2}"), "$.test")
        .toArray();
    deepEqual(actual, [{ test: 1 }, { test: 0}]);
});

test("sequenceEqual", function ()
{
    ok(!Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9]).sequenceEqual([1, 3, 5]));
    ok(Enumerable.range(1, 10).sequenceEqual(Enumerable.range(1, 10)));

    ok(!Enumerable.range(1, 10).select("{test:$%3}")
        .sequenceEqual(Enumerable.range(1, 10).select("{test:$%2}"), "$.test"));

    ok(Enumerable.range(1, 10)
        .select("{test:$%3}")
        .distinct("$.test")
        .sequenceEqual([{ test: 1 }, { test: 2 }, { test: 0}], "$.test"));
});

test("union", function ()
{
    actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9])
        .union([4, 6, 2, 7, 8, 10, 11])
        .toArray();
    deepEqual(actual, [1, 3, 5, 6, 4, 2, 9, 7, 8, 10, 11]);
    actual = Enumerable.range(1, 3).select("{test:$}")
        .union(Enumerable.range(2, 3).select("{test:$}"), "$.test")
        .toArray();
    deepEqual(actual, [{ test: 1 }, { test: 2 }, { test: 3 }, { test: 4}]);
});
