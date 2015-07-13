var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("Dictionary");

var expected, actual; // will be removed

var result;
var correct;
var aComparer = function (x) { return x.a }
var obj1 = { a: 1 }
var obj1_ = { a: 1 }
var obj2 = { a: 2 }
var obj2_ = { a: 2 }

test("AddGetCountRemoveClear", function ()
{
    var dict = Enumerable.empty().toDictionary();
    dict.add("a", 1);
    dict.add("b", 2);
    dict.add("c", 3);
    dict.add("c", 100);
    equal(1, dict.get("a"));
    equal(2, dict.get("b"));
    equal(100, dict.get("c"));

    dict.add(obj1, 1);
    dict.add(obj1_, 2);
    dict.add(obj2, 3);
    dict.add(obj2_, 4);
    equal(1, dict.get(obj1));
    equal(2, dict.get(obj1_));
    equal(3, dict.get(obj2));
    equal(4, dict.get(obj2_));

    equal(7, dict.count());

    dict.remove("a");
    dict.remove(obj1);
    dict.remove(obj1_);
    dict.remove(obj2_);
    equal(undefined, dict.get("a"));
    equal(undefined, dict.get(obj1));
    equal(undefined, dict.get(obj1_));
    equal(undefined, dict.get(obj2_));

    equal(3, dict.count());
    dict.clear();
    equal(undefined, dict.get("b"));
    equal(undefined, dict.get(obj2));
    equal(0, dict.count());

    dict = Enumerable.empty().toDictionary("", "", aComparer);

    dict.add(obj1, 1);
    dict.add(obj1_, 2);
    dict.add(obj2, 3);
    dict.add(obj2_, 4);
    equal(2, dict.get(obj1));
    equal(2, dict.get(obj1_));
    equal(4, dict.get(obj2));
    equal(4, dict.get(obj2_));

    equal(2, dict.count());

    dict.remove(obj1);
    equal(undefined, dict.get(obj1));
    equal(undefined, dict.get(obj1_));

    equal(1, dict.count());
    dict.clear();
    equal(undefined, dict.get(obj2));
    equal(undefined, dict.get(obj2_));
    equal(0, dict.count());
});

test("SetContains", function ()
{
    var dict = Enumerable.empty().toDictionary();
    dict.add("a", 1);
    dict.add("b", 2);
    dict.add(obj1, 1);
    dict.add(obj1_, 2);
    dict.set("a", 1000);
    dict.set("b", 2000);
    dict.set(obj1, 10000);
    dict.set(obj1_, 20000);
    equal(1000, dict.get("a"));
    equal(2000, dict.get("b"));
    equal(10000, dict.get(obj1));
    equal(20000, dict.get(obj1_));
    ok(dict.contains("a"));
    ok(dict.contains("b"));
    ok(dict.contains(obj1));
    ok(dict.contains(obj1_));
    ok(!dict.contains("c"));
    ok(!dict.contains(obj2));

    dict = Enumerable.empty().toDictionary("", "", aComparer);
    dict.add(obj1, 1);
    dict.add(obj1_, 2);
    dict.add(obj2, 3);
    dict.add(obj2_, 4);
    dict.set(obj1, 10000);
    dict.set(obj1_, 20000);
    dict.set(obj2, 30000);
    dict.set(obj2_, 40000);
    equal(20000, dict.get(obj1));
    equal(20000, dict.get(obj1_));
    equal(40000, dict.get(obj2));
    equal(40000, dict.get(obj2_));
    ok(dict.contains(obj1));
    ok(dict.contains(obj1_));
    ok(!dict.contains({ a: 3 }));
});

test("toEnumerable", function ()
{
    var dict = Enumerable.empty().toDictionary();
    dict.add("a", 1);
    dict.add("b", 2);
    dict.add("c", 3);

    var ar = dict.toEnumerable().orderBy("$.key").toArray();
    equal("a", ar[0].key);
    equal(1, ar[0].value);
    equal("b", ar[1].key);
    equal(2, ar[1].value);
    equal("c", ar[2].key);
    equal(3, ar[2].value);

    dict.clear();
    dict.add(obj1, 1);
    dict.add(obj1_, 2);
    dict.add(obj2, 3);
    dict.add(obj2_, 4);

    ar = dict.toEnumerable().orderBy("$.key.a").toArray();
    equal(obj1, ar[0].key);
    equal(1, ar[0].value);
    equal(obj1_, ar[1].key);
    equal(2, ar[1].value);
    equal(obj2, ar[2].key);
    equal(3, ar[2].value);
    equal(obj2_, ar[3].key);
    equal(4, ar[3].value);

    dict = Enumerable.empty().toDictionary("", "", aComparer);
    dict.add(obj1, 1);
    dict.add(obj1_, 2);
    dict.add(obj2, 3);
    dict.add(obj2_, 4);
    ar = dict.toEnumerable().orderBy("$.key.a").toArray();
    equal(obj1_, ar[0].key);
    equal(2, ar[0].value);
    equal(obj2_, ar[1].key);
    equal(4, ar[1].value);
});
