var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("Paging");

var expected, actual; // will be removed

test("elementAt", function () {
    actual = Enumerable.range(1, 10).elementAt(5);
    strictEqual(actual, 6);
});

test("elementAtOrDefault", function () {
    actual = Enumerable.range(1, 10).elementAtOrDefault(3, 0);
    strictEqual(actual, 4);
    actual = Enumerable.range(1, 10).elementAtOrDefault(31, 0);
    strictEqual(actual, 0);

    actual = Enumerable.range(1, 10).elementAtOrDefault(3, "foo");
    strictEqual(actual, 4);
    actual = Enumerable.range(1, 10).elementAtOrDefault(31, "foo");
    strictEqual(actual, "foo");
});

test("first", function () {
    actual = Enumerable.range(1, 10).first();
    strictEqual(actual, 1);
    actual = Enumerable.range(1, 10).first("i=>i*3==6");
    strictEqual(actual, 2);
});

test("firstOrDefault", function () {
    var nonEmpty = Enumerable.range(1, 10);
    var empty = Enumerable.empty();

    // No arguments.
    strictEqual(nonEmpty.firstOrDefault(), 1);
    strictEqual(empty.firstOrDefault(), undefined);

    // No predicate.
    strictEqual(nonEmpty.firstOrDefault(0), 1);
    strictEqual(empty.firstOrDefault(0), 0);
    strictEqual(empty.firstOrDefault(undefined), undefined);

    // "null" predicate.
    strictEqual(nonEmpty.firstOrDefault(null, 0), 1);
    strictEqual(empty.firstOrDefault(null), undefined); // Because "null" is treated as noop predicate.
    strictEqual(empty.firstOrDefault(null, 0), 0);
    strictEqual(empty.firstOrDefault(null, null), null);
    strictEqual(empty.firstOrDefault(null, undefined), undefined);

    // No default value.
    strictEqual(nonEmpty.firstOrDefault("i=>true"), 1);
    strictEqual(empty.firstOrDefault("i=>true"), undefined);

    // Both arguments.
    strictEqual(nonEmpty.firstOrDefault("i=>true", 0), 1);
    strictEqual(empty.firstOrDefault("i=>true", 0), 0);
    strictEqual(empty.firstOrDefault("i=>true", null), null);
    strictEqual(empty.firstOrDefault("i=>true", undefined), undefined);
});

test("last", function () {
    actual = Enumerable.range(1, 10).last();
    strictEqual(actual, 10);

    actual = Enumerable.range(1, 10).last("i=>i<6");
    strictEqual(actual, 5);
});

test("lastOrDefault", function () {
    var nonEmpty = Enumerable.range(1, 10);
    var empty = Enumerable.empty();

    // No arguments.
    strictEqual(nonEmpty.lastOrDefault(), 10);
    strictEqual(empty.lastOrDefault(), undefined);

    // No predicate.
    strictEqual(nonEmpty.lastOrDefault(0), 10);
    strictEqual(empty.lastOrDefault(0), 0);
    strictEqual(empty.lastOrDefault(undefined), undefined);

    // "null" predicate.
    strictEqual(nonEmpty.lastOrDefault(null, 0), 10);
    strictEqual(empty.lastOrDefault(null), undefined); // Because "null" is treated as noop predicate.
    strictEqual(empty.lastOrDefault(null, 0), 0);
    strictEqual(empty.lastOrDefault(null, null), null);
    strictEqual(empty.lastOrDefault(null, undefined), undefined);

    // No default value.
    strictEqual(nonEmpty.lastOrDefault("i=>true"), 10);
    strictEqual(empty.lastOrDefault("i=>true"), undefined);

    // Both arguments.
    strictEqual(nonEmpty.lastOrDefault("i=>true", 0), 10);
    strictEqual(empty.lastOrDefault("i=>true", 0), 0);
    strictEqual(empty.lastOrDefault("i=>true", null), null);
    strictEqual(empty.lastOrDefault("i=>true", undefined), undefined);
});

test("single", function () {
    actual = Enumerable.range(1, 1).single();
    strictEqual(actual, 1);

    actual = Enumerable.range(1, 10).single("i=>i==6");
    strictEqual(actual, 6);
});

test("singleOrDefault", function () {
    actual = Enumerable.range(1, 1).singleOrDefault(null, 0);
    strictEqual(actual, 1);
    actual = Enumerable.range(1, 10).skip(11).singleOrDefault(null, 0);
    strictEqual(actual, 0);

    actual = Enumerable.range(1, 1).singleOrDefault(null, 34);
    strictEqual(actual, 1);
    actual = Enumerable.range(1, 10).skip(11).singleOrDefault(null, 34);
    strictEqual(actual, 34);

    actual = Enumerable.range(1, 10).singleOrDefault("i=>i*3==6", 4);
    strictEqual(actual, 2);
    actual = Enumerable.range(1, 10).singleOrDefault("i=>i>13", 40);
    strictEqual(actual, 40);

    Enumerable.range(1, 1).singleOrDefault().is(1);
    Enumerable.range(1, 10).singleOrDefault("i=>i*3==6").is(2);
    (Enumerable.range(1, 10).singleOrDefault("i=>i>13") === null).isTrue();
    (Enumerable.empty().singleOrDefault() === null).isTrue();
});

test("skip", function () {
    actual = Enumerable.range(1, 10).skip(4).toArray();
    deepEqual(actual, [5, 6, 7, 8, 9, 10]);
});

test("skipWhile", function () {
    actual = Enumerable.range(1, 10).skipWhile("i=>i<8").toArray();
    deepEqual(actual, [8, 9, 10]);

    actual = Enumerable.range(1, 10).skipWhile("v,i=>i<8").toArray();
    deepEqual(actual, [9, 10]);
});

test("take", function () {
    actual = Enumerable.range(1, 10).take(4).toArray();
    deepEqual(actual, [1, 2, 3, 4]);
});

test("takeWhile", function () {
    actual = Enumerable.range(1, 10).takeWhile("i=>i<8").toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7]);

    actual = Enumerable.range(1, 10).takeWhile("v,i=>i<8").toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8]);
});

test("takeExceptLast", function () {
    actual = Enumerable.range(1, 10).takeExceptLast().toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    actual = Enumerable.range(1, 10).takeExceptLast(3).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7]);
    actual = Enumerable.range(1, 10).takeExceptLast(-1).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    actual = Enumerable.range(1, 10).takeExceptLast(100).toArray();
    deepEqual(actual, []);
});

test("takeFromLast", function () {
    actual = Enumerable.range(1, 10).takeFromLast(3).toArray();
    deepEqual(actual, [8, 9, 10]);
    actual = Enumerable.range(1, 10).takeFromLast(100).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    actual = Enumerable.range(1, 10).takeFromLast(0).toArray();
    deepEqual(actual, []);
    actual = Enumerable.range(1, 10).takeFromLast(-10).toArray();
    deepEqual(actual, []);
});

test("indexOf", function () {
    actual = Enumerable.range(1, 10).indexOf(3);
    strictEqual(actual, 2);

    [1, 10, 100, 1000, 100, 100].asEnumerable().indexOf(100).is(2);

    [1, 2, 3, 3, 3, 4, 5].asEnumerable().indexOf(3).is(2);
    [1, 2, 3, 3, 3, 4, 5].asEnumerable().indexOf(function (x) { return x == 3; }).is(2);
});

test("lastIndexOf", function () {
    actual = Enumerable.from([1, 2, 3, 2, 5]).lastIndexOf(2)
    strictEqual(actual, 3);

    [1, 2, 3, 3, 3, 4, 5].asEnumerable().lastIndexOf(3).is(4);
    [1, 2, 3, 3, 3, 4, 5].asEnumerable().lastIndexOf(function (x) { return x == 3; }).is(4);
});
