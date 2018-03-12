var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("ArrayEnumerable");

var arraySequence = Enumerable.from([1, 10, 100, 1000, 10000]);
var emptySequence = Enumerable.from([]);

test("any", function () {
    ok(arraySequence.any());
    ok(!emptySequence.any());
    ok(arraySequence.any("$==100"));
    ok(!emptySequence.any("$==2"));
});

test("count", function () {
    equal(arraySequence.count(), 5);
    equal(emptySequence.count(), 0);
    equal(arraySequence.count("$<=100"), 3);
    equal(emptySequence.count("$<=100"), 0);
});

test("elementAt", function () {
    equal(arraySequence.elementAt(3), 1000);
    try {
        arraySequence.elementAt(-1);
        ok(false);
    }
    catch (e) { ok(true, "okay"); }

    try {
        arraySequence.elementAt(100);
        ok(false);
    }
    catch (e) { ok(true); }
});

test("elementAtOrDefault", function () {
    equal(arraySequence.elementAtOrDefault(4), 10000);
    equal(arraySequence.elementAtOrDefault(-1, -100), -100);
    equal(arraySequence.elementAtOrDefault(5, -100), -100);
});

test("first", function () {
    equal(arraySequence.first(), 1);
    equal(arraySequence.first("$>=100"), 100);

    try {
        arraySequence.first("$==-1");
        ok(false);
    }
    catch (e) { ok(true); }

    try {
        emptySequence.first();
        ok(false);
    }
    catch (e) { ok(true); }
});

test("firstOrDefault", function () {
    // No arguments.
    strictEqual(arraySequence.firstOrDefault(), 1);
    strictEqual(emptySequence.firstOrDefault(), undefined);

    // No predicate.
    strictEqual(arraySequence.firstOrDefault(0), 1);
    strictEqual(emptySequence.firstOrDefault(0), 0);
    strictEqual(emptySequence.firstOrDefault(undefined), undefined);

    // "null" predicate.
    strictEqual(arraySequence.firstOrDefault(null, 0), 1);
    strictEqual(emptySequence.firstOrDefault(null), undefined); // Because "null" is treated as noop predicate.
    strictEqual(emptySequence.firstOrDefault(null, 0), 0);
    strictEqual(emptySequence.firstOrDefault(null, null), null);
    strictEqual(emptySequence.firstOrDefault(null, undefined), undefined);

    // No default value.
    strictEqual(arraySequence.firstOrDefault("i=>true"), 1);
    strictEqual(emptySequence.firstOrDefault("i=>true"), undefined);

    // Both arguments.
    strictEqual(arraySequence.firstOrDefault("i=>true", 0), 1);
    strictEqual(emptySequence.firstOrDefault("i=>true", 0), 0);
    strictEqual(emptySequence.firstOrDefault("i=>true", null), null);
    strictEqual(emptySequence.firstOrDefault("i=>true", undefined), undefined);
});

test("last", function () {
    equal(arraySequence.last(), 10000);
    equal(arraySequence.last("$<=500"), 100);

    try {
        arraySequence.last("$==-1");
        ok(false);
    }
    catch (e) { ok(true); }

    try {
        emptySequence.last();
        ok(false);
    }
    catch (e) { ok(true); }
});

test("lastOrDefault", function () {
    // No arguments.
    strictEqual(arraySequence.lastOrDefault(), 10000);
    strictEqual(emptySequence.lastOrDefault(), undefined);

    // No predicate.
    strictEqual(arraySequence.lastOrDefault(0), 10000);
    strictEqual(emptySequence.lastOrDefault(0), 0);
    strictEqual(emptySequence.lastOrDefault(undefined), undefined);

    // "null" predicate.
    strictEqual(arraySequence.lastOrDefault(null, 0), 10000);
    strictEqual(emptySequence.lastOrDefault(null), undefined); // Because "null" is treated as noop predicate.
    strictEqual(emptySequence.lastOrDefault(null, 0), 0);
    strictEqual(emptySequence.lastOrDefault(null, null), null);
    strictEqual(emptySequence.lastOrDefault(null, undefined), undefined);

    // No default value.
    strictEqual(arraySequence.lastOrDefault("i=>true"), 10000);
    strictEqual(emptySequence.lastOrDefault("i=>true"), undefined);

    // Both arguments.
    strictEqual(arraySequence.lastOrDefault("i=>true", 0), 10000);
    strictEqual(emptySequence.lastOrDefault("i=>true", 0), 0);
    strictEqual(emptySequence.lastOrDefault("i=>true", null), null);
    strictEqual(emptySequence.lastOrDefault("i=>true", undefined), undefined);
});

test("skip", function () {
    deepEqual(arraySequence.skip(3).toArray(), [1000, 10000]);
    deepEqual(arraySequence.skip(-10).toArray(), [1, 10, 100, 1000, 10000]);
    deepEqual(arraySequence.skip(10).toArray(), []);
    deepEqual(emptySequence.skip(3).toArray(), []);
});

test("takeExceptLast", function () {
    deepEqual(arraySequence.takeExceptLast().toArray(), [1, 10, 100, 1000]);
    deepEqual(arraySequence.takeExceptLast(3).toArray(), [1, 10]);
    deepEqual(arraySequence.takeExceptLast(-100).toArray(), [1, 10, 100, 1000, 10000]);
    deepEqual(arraySequence.takeExceptLast(0).toArray(), [1, 10, 100, 1000, 10000]);
    deepEqual(arraySequence.takeExceptLast(100).toArray(), []);
});

test("takeFromLast", function () {
    deepEqual(arraySequence.takeFromLast(3).toArray(), [100, 1000, 10000]);
    deepEqual(arraySequence.takeFromLast(0).toArray(), []);
    deepEqual(arraySequence.takeFromLast(-100).toArray(), []);
    deepEqual(arraySequence.takeFromLast(100).toArray(), [1, 10, 100, 1000, 10000]);
});

test("reverse", function () {
    deepEqual(arraySequence.reverse().toArray(), [10000, 1000, 100, 10, 1]);
    deepEqual(emptySequence.reverse().toArray(), []);
});

test("sequenceEqual", function () {
    ok(arraySequence.sequenceEqual([1, 10, 100, 1000, 10000]));
    ok(!arraySequence.sequenceEqual([1, 10, 100, 1000, 10000, 100000]));
    ok(!arraySequence.sequenceEqual([1, 10, 100, 1000]));
    ok(!arraySequence.sequenceEqual([1, 10, 500, 1000, 10000]));
});

test("toJoinedString", function () {
    equal(arraySequence.toJoinedString(), "110100100010000");
    equal(arraySequence.toJoinedString("-"), "1-10-100-1000-10000");
    equal(arraySequence.toJoinedString("-", "$+1"), "2-11-101-1001-10001");
});
