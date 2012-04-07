var module = QUnit.module;
var Enumerable = require('../linq');

module("Dictionary");

var result;
var correct;
var aComparer = function (x) { return x.a }
var obj1 = { a: 1 }
var obj1_ = { a: 1 }
var obj2 = { a: 2 }
var obj2_ = { a: 2 }

test("AddGetCountRemoveClear", function ()
{
    var dict = Enumerable.Empty().ToDictionary();
    dict.Add("a", 1);
    dict.Add("b", 2);
    dict.Add("c", 3);
    dict.Add("c", 100);
    equal(1, dict.Get("a"));
    equal(2, dict.Get("b"));
    equal(100, dict.Get("c"));

    dict.Add(obj1, 1);
    dict.Add(obj1_, 2);
    dict.Add(obj2, 3);
    dict.Add(obj2_, 4);
    equal(1, dict.Get(obj1));
    equal(2, dict.Get(obj1_));
    equal(3, dict.Get(obj2));
    equal(4, dict.Get(obj2_));

    equal(7, dict.Count());

    dict.Remove("a");
    dict.Remove(obj1);
    dict.Remove(obj1_);
    dict.Remove(obj2_);
    equal(undefined, dict.Get("a"));
    equal(undefined, dict.Get(obj1));
    equal(undefined, dict.Get(obj1_));
    equal(undefined, dict.Get(obj2_));

    equal(3, dict.Count());
    dict.Clear();
    equal(undefined, dict.Get("b"));
    equal(undefined, dict.Get(obj2));
    equal(0, dict.Count());

    dict = Enumerable.Empty().ToDictionary("", "", aComparer);

    dict.Add(obj1, 1);
    dict.Add(obj1_, 2);
    dict.Add(obj2, 3);
    dict.Add(obj2_, 4);
    equal(2, dict.Get(obj1));
    equal(2, dict.Get(obj1_));
    equal(4, dict.Get(obj2));
    equal(4, dict.Get(obj2_));

    equal(2, dict.Count());

    dict.Remove(obj1);
    equal(undefined, dict.Get(obj1));
    equal(undefined, dict.Get(obj1_));

    equal(1, dict.Count());
    dict.Clear();
    equal(undefined, dict.Get(obj2));
    equal(undefined, dict.Get(obj2_));
    equal(0, dict.Count());
});

test("SetContains", function ()
{
    var dict = Enumerable.Empty().ToDictionary();
    dict.Add("a", 1);
    dict.Add("b", 2);
    dict.Add(obj1, 1);
    dict.Add(obj1_, 2);
    dict.Set("a", 1000);
    dict.Set("b", 2000);
    dict.Set(obj1, 10000);
    dict.Set(obj1_, 20000);
    equal(1000, dict.Get("a"));
    equal(2000, dict.Get("b"));
    equal(10000, dict.Get(obj1));
    equal(20000, dict.Get(obj1_));
    ok(dict.Contains("a"));
    ok(dict.Contains("b"));
    ok(dict.Contains(obj1));
    ok(dict.Contains(obj1_));
    ok(!dict.Contains("c"));
    ok(!dict.Contains(obj2));

    dict = Enumerable.Empty().ToDictionary("", "", aComparer);
    dict.Add(obj1, 1);
    dict.Add(obj1_, 2);
    dict.Add(obj2, 3);
    dict.Add(obj2_, 4);
    dict.Set(obj1, 10000);
    dict.Set(obj1_, 20000);
    dict.Set(obj2, 30000);
    dict.Set(obj2_, 40000);
    equal(20000, dict.Get(obj1));
    equal(20000, dict.Get(obj1_));
    equal(40000, dict.Get(obj2));
    equal(40000, dict.Get(obj2_));
    ok(dict.Contains(obj1));
    ok(dict.Contains(obj1_));
    ok(!dict.Contains({ a: 3 }));
});

test("ToEnumerable", function ()
{
    var dict = Enumerable.Empty().ToDictionary();
    dict.Add("a", 1);
    dict.Add("b", 2);
    dict.Add("c", 3);

    var ar = dict.ToEnumerable().OrderBy("$.Key").ToArray();
    equal("a", ar[0].Key);
    equal(1, ar[0].Value);
    equal("b", ar[1].Key);
    equal(2, ar[1].Value);
    equal("c", ar[2].Key);
    equal(3, ar[2].Value);

    dict.Clear();
    dict.Add(obj1, 1);
    dict.Add(obj1_, 2);
    dict.Add(obj2, 3);
    dict.Add(obj2_, 4);

    ar = dict.ToEnumerable().OrderBy("$.Key.a").ToArray();
    equal(obj1, ar[0].Key);
    equal(1, ar[0].Value);
    equal(obj1_, ar[1].Key);
    equal(2, ar[1].Value);
    equal(obj2, ar[2].Key);
    equal(3, ar[2].Value);
    equal(obj2_, ar[3].Key);
    equal(4, ar[3].Value);

    dict = Enumerable.Empty().ToDictionary("", "", aComparer);
    dict.Add(obj1, 1);
    dict.Add(obj1_, 2);
    dict.Add(obj2, 3);
    dict.Add(obj2_, 4);
    ar = dict.ToEnumerable().OrderBy("$.Key.a").ToArray();
    equal(obj1_, ar[0].Key);
    equal(2, ar[0].Value);
    equal(obj2_, ar[1].Key);
    equal(4, ar[1].Value);
});