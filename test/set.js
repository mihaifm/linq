var {test, testModule, deepEqual, ok, strictEqual} = require('./testutils.js')
var Enumerable = require('../linq.min');

testModule("Set");

test("all", function () {
    var seq = Enumerable.range(1, 10);
    ok(!seq.all("i=>i%2==0"));
    ok(seq.all("i=>i<=10"));
});

test("any", function () {
    var seq = Enumerable.range(1, 10);
    var empty = Enumerable.empty();
    ok(seq.any());
    ok(!empty.any());
    ok(seq.any("$==5"));
    ok(!seq.any("$==100"));
});

test("isEmpty", function () {
    var _ = Enumerable.range(1, 10).isEmpty();

    strictEqual(_, false);
    strictEqual(Enumerable.empty().isEmpty(), true);

    Enumerable.Utils.extendTo(Array);
    strictEqual([].isEmpty(), true);
    Enumerable.Utils.recallFrom(Array);
});

test("concat", function () {
    let actual = Enumerable.range(1, 3).concat([20, 21, 22]).toArray();
    deepEqual(actual, [1, 2, 3, 20, 21, 22]);


    deepEqual(Enumerable.range(1, 3).concat([]).toArray(), [1, 2, 3]);
    deepEqual(Enumerable.range(1, 3).concat([2, 3], [4, 5]).toArray(), [1, 2, 3, 2, 3, 4, 5]);
    var range = Enumerable.rangeTo(3, 5);
    deepEqual(range.concat(range, range, range, range).toArray(), Enumerable.repeat(range, 5).selectMany().toArray());
});

test("insert", function () {
    let actual = Enumerable.range(1, 5).insert(3, [20, 21, 22]).toArray();
    deepEqual(actual, [1, 2, 3, 20, 21, 22, 4, 5]);
});

test("alternate", function () {
    Enumerable.Utils.extendTo(Array);

    // single value
    deepEqual(Enumerable.empty().alternate(-1).toArray(), []);

    deepEqual([1].alternate(-1).toArray(), [1]);
    deepEqual([1, 2].alternate(-1).toArray(), [1, -1, 2]);
    deepEqual(Enumerable.range(1, 5).alternate(-1).toArray(), [1, -1, 2, -1, 3, -1, 4, -1, 5]);
    deepEqual(Enumerable.range(1, 6).alternate(-1).toArray(), [1, -1, 2, -1, 3, -1, 4, -1, 5, -1, 6]);

    // multiple, array
    deepEqual(Enumerable.empty().alternate([-1, -2]).toArray(), []);
    deepEqual([1].alternate([-1, -2]).toArray(), [1]);
    deepEqual([1, 2].alternate([-1, -2]).toArray(), [1, -1, -2, 2]);
    deepEqual(Enumerable.range(1, 5).alternate([-1, -2]).toArray(), [1, -1, -2, 2, -1, -2, 3, -1, -2, 4, -1, -2, 5]);
    deepEqual(Enumerable.range(1, 6).alternate([-1, -2]).toArray(), [1, -1, -2, 2, -1, -2, 3, -1, -2, 4, -1, -2, 5, -1, -2, 6]);

    // multiple, enumerable
    var seq = Enumerable.rangeTo(-1, -2);
    deepEqual(Enumerable.empty().alternate(seq).toArray(), []);
    deepEqual([1].alternate(seq).toArray(), [1]);
    deepEqual([1, 2].alternate(seq).toArray(), [1, -1, -2, 2]);
    deepEqual(Enumerable.range(1, 5).alternate(seq).toArray(), [1, -1, -2, 2, -1, -2, 3, -1, -2, 4, -1, -2, 5]);
    deepEqual(Enumerable.range(1, 6).alternate(seq).toArray(), [1, -1, -2, 2, -1, -2, 3, -1, -2, 4, -1, -2, 5, -1, -2, 6]);
});

test("contains", function () {
    var seq = Enumerable.range(1, 10);
    ok(seq.contains(5));
    ok(!seq.contains(13));

    seq = Enumerable.range(1, 10).select("{test:$%2}");
    ok(seq.contains(1, "$.test"));
    ok(!seq.contains(3, "$.test"));
});

test("defaultIfEmpty", function () {
    let actual = Enumerable.range(1, 10).defaultIfEmpty(199).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    actual = Enumerable.empty().defaultIfEmpty(199).toArray();
    deepEqual(actual, [199]);
});

test("distinct", function () {
    let actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9]).distinct().toArray();
    deepEqual(actual, [1, 3, 5, 6, 4, 2, 9]);
    actual = Enumerable.range(1, 10).select("{test:$%2}").distinct("$.test").toArray();
    deepEqual(actual, [{ test: 1 }, { test: 0 }]);
});

test("distinctUntilChanged", function () {
    Enumerable.Utils.extendTo(Array);

    deepEqual([9, 1, 3, 5, 7, 7, 7, 3, 4, 2, 2, 9].distinctUntilChanged().toArray(), [9, 1, 3, 5, 7, 3, 4, 2, 9]);
    deepEqual([1, 3, 3, 3, 1, 2, 6, 3, 5, 1]
        .select("{test:$}")
        .distinctUntilChanged("$.test").toArray(),
        [{ test: 1 }, { test: 3 }, { test: 1 }, { test: 2 }, { test: 6 }, { test: 3 }, { test: 5 }, { test: 1 }]);

    deepEqual([1].distinctUntilChanged().toArray(), [1]);
    deepEqual([1, 1].distinctUntilChanged().toArray(), [1]);
    deepEqual([1, 2].distinctUntilChanged().toArray(), [1, 2]);

    Enumerable.Utils.recallFrom(Array);
});

test("except", function () {
    let actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9])
        .except([4, 6, 2, 7, 8, 10, 11])
        .toArray();
    deepEqual(actual, [1, 3, 5, 9]);
    actual = Enumerable.range(1, 10).select("{test:$%3}")
        .except(Enumerable.range(1, 10).select("{test:$%2}"), "$.test")
        .toArray();
    deepEqual(actual, [{ test: 2 }]);
});

test("intersect", function () {
    let actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9])
        .intersect([4, 6, 2, 7, 8, 10, 11])
        .toArray();
    deepEqual(actual, [6, 4, 2]);
    actual = Enumerable.range(1, 10).select("{test:$%3}")
        .intersect(Enumerable.range(1, 10).select("{test:$%2}"), "$.test")
        .toArray();
    deepEqual(actual, [{ test: 1 }, { test: 0 }]);
});

test("sequenceEqual", function () {
    ok(!Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9]).sequenceEqual([1, 3, 5]));
    ok(Enumerable.range(1, 10).sequenceEqual(Enumerable.range(1, 10)));

    ok(!Enumerable.range(1, 10).select("{test:$%3}")
        .sequenceEqual(Enumerable.range(1, 10).select("{test:$%2}"), "$.test"));

    ok(Enumerable.range(1, 10)
        .select("{test:$%3}")
        .distinct("$.test")
        .sequenceEqual([{ test: 1 }, { test: 2 }, { test: 0 }], "$.test"));
});

test("union", function () {
    let actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9])
        .union([4, 6, 2, 7, 8, 10, 11])
        .toArray();
    deepEqual(actual, [1, 3, 5, 6, 4, 2, 9, 7, 8, 10, 11]);
    actual = Enumerable.range(1, 3).select("{test:$}")
        .union(Enumerable.range(2, 3).select("{test:$}"), "$.test")
        .toArray();
    deepEqual(actual, [{ test: 1 }, { test: 2 }, { test: 3 }, { test: 4 }]);
});
