var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("Set");

var expected, actual; // will be removed

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

    _.is(false);
    Enumerable.empty().isEmpty().is(true);

    [].isEmpty().is(true);
});

test("concat", function () {
    actual = Enumerable.range(1, 3).concat([20, 21, 22]).toArray();
    deepEqual(actual, [1, 2, 3, 20, 21, 22]);


    Enumerable.range(1, 3).concat([]).is(1, 2, 3);
    Enumerable.range(1, 3).concat([2, 3], [4, 5]).is(1, 2, 3, 2, 3, 4, 5);
    var range = Enumerable.rangeTo(3, 5);
    range.concat(range, range, range, range).is(Enumerable.repeat(range, 5).selectMany());
});

test("insert", function () {
    actual = Enumerable.range(1, 5).insert(3, [20, 21, 22]).toArray();
    deepEqual(actual, [1, 2, 3, 20, 21, 22, 4, 5]);
});

test("alternate", function () {
    // single value
    Enumerable.empty().alternate(-1).is([]);
    [1].alternate(-1).is(1);
    [1, 2].alternate(-1).is(1, -1, 2);
    Enumerable.range(1, 5).alternate(-1).is(1, -1, 2, -1, 3, -1, 4, -1, 5);
    Enumerable.range(1, 6).alternate(-1).is(1, -1, 2, -1, 3, -1, 4, -1, 5, -1, 6);

    // multiple, array
    Enumerable.empty().alternate([-1, -2]).is([]);
    [1].alternate([-1, -2]).is(1);
    [1, 2].alternate([-1, -2]).is(1, -1, -2, 2);
    Enumerable.range(1, 5).alternate([-1, -2]).is(1, -1, -2, 2, -1, -2, 3, -1, -2, 4, -1, -2, 5);
    Enumerable.range(1, 6).alternate([-1, -2]).is(1, -1, -2, 2, -1, -2, 3, -1, -2, 4, -1, -2, 5, -1, -2, 6);

    // multiple, enumerable
    var seq = Enumerable.rangeTo(-1, -2);
    Enumerable.empty().alternate(seq).is([]);
    [1].alternate(seq).is(1);
    [1, 2].alternate(seq).is(1, -1, -2, 2);
    Enumerable.range(1, 5).alternate(seq).is(1, -1, -2, 2, -1, -2, 3, -1, -2, 4, -1, -2, 5);
    Enumerable.range(1, 6).alternate(seq).is(1, -1, -2, 2, -1, -2, 3, -1, -2, 4, -1, -2, 5, -1, -2, 6);
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
    actual = Enumerable.range(1, 10).defaultIfEmpty(199).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    actual = Enumerable.empty().defaultIfEmpty(199).toArray();
    deepEqual(actual, [199]);
});

test("distinct", function () {
    actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9]).distinct().toArray();
    deepEqual(actual, [1, 3, 5, 6, 4, 2, 9]);
    actual = Enumerable.range(1, 10).select("{test:$%2}").distinct("$.test").toArray();
    deepEqual(actual, [{ test: 1 }, { test: 0 }]);
});

test("distinctUntilChanged", function () {
    [9, 1, 3, 5, 7, 7, 7, 3, 4, 2, 2, 9].distinctUntilChanged().is(9, 1, 3, 5, 7, 3, 4, 2, 9);
    [1, 3, 3, 3, 1, 2, 6, 3, 5, 1]
        .select("{test:$}")
        .distinctUntilChanged("$.test")
        .is({ test: 1 }, { test: 3 }, { test: 1 }, { test: 2 }, { test: 6 }, { test: 3 }, { test: 5 }, { test: 1 });

    [1].distinctUntilChanged().is(1);
    [1, 1].distinctUntilChanged().is(1);
    [1, 2].distinctUntilChanged().is(1, 2);
});

test("except", function () {
    actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9])
        .except([4, 6, 2, 7, 8, 10, 11])
        .toArray();
    deepEqual(actual, [1, 3, 5, 9]);
    actual = Enumerable.range(1, 10).select("{test:$%3}")
        .except(Enumerable.range(1, 10).select("{test:$%2}"), "$.test")
        .toArray();
    deepEqual(actual, [{ test: 2 }]);
});

test("intersect", function () {
    actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9])
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
    actual = Enumerable.from([1, 3, 5, 6, 6, 3, 4, 3, 2, 9])
        .union([4, 6, 2, 7, 8, 10, 11])
        .toArray();
    deepEqual(actual, [1, 3, 5, 6, 4, 2, 9, 7, 8, 10, 11]);
    actual = Enumerable.range(1, 3).select("{test:$}")
        .union(Enumerable.range(2, 3).select("{test:$}"), "$.test")
        .toArray();
    deepEqual(actual, [{ test: 1 }, { test: 2 }, { test: 3 }, { test: 4 }]);
});
