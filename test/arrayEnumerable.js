var module = QUnit.module;

module("ArrayEnumerable");

var arraySequence = Enumerable.From([1, 10, 100, 1000, 10000]);
var emptySequence = Enumerable.From([]);

test("Any", function ()
{
    ok(arraySequence.Any());
    ok(!emptySequence.Any());
    ok(arraySequence.Any("$==100"));
    ok(!emptySequence.Any("$==2"));
});

test("Count", function ()
{
    equal(arraySequence.Count(), 5);
    equal(emptySequence.Count(), 0);
    equal(arraySequence.Count("$<=100"), 3);
    equal(emptySequence.Count("$<=100"), 0);
});

test("ElementAt", function ()
{
    equal(arraySequence.ElementAt(3), 1000);
    try
    {
        arraySequence.ElementAt(-1);
        ok(false);
    }
    catch (e) { ok(true, "okay"); }

    try
    {
        arraySequence.ElementAt(100);
        ok(false);
    }
    catch (e) { ok(true); }
});

test("ElementAtOrDefault", function ()
{
    equal(arraySequence.ElementAtOrDefault(4), 10000);
    equal(arraySequence.ElementAtOrDefault(-1, -100), -100);
    equal(arraySequence.ElementAtOrDefault(5, -100), -100);
});

test("First", function ()
{
    equal(arraySequence.First(), 1);
    equal(arraySequence.First("$>=100"), 100);

    try
    {
        arraySequence.First("$==-1");
        ok(false);
    }
    catch (e) { ok(true); }

    try
    {
        emptySequence.First();
        ok(false);
    }
    catch (e) { ok(true); }
});

test("FirstOrDefault", function ()
{
    equal(arraySequence.FirstOrDefault(-100), 1);
    equal(arraySequence.FirstOrDefault(-100, "$>=100"), 100);
    equal(arraySequence.FirstOrDefault(-100, "$==-1"), -100);
    equal(emptySequence.FirstOrDefault(-100), -100);
    equal(emptySequence.FirstOrDefault(-100, "$==100"), -100);
});

test("Last", function ()
{
    equal(arraySequence.Last(), 10000);
    equal(arraySequence.Last("$<=500"), 100);

    try
    {
        arraySequence.Last("$==-1");
        ok(false);
    }
    catch (e) { ok(true); }

    try
    {
        emptySequence.Last();
        ok(false);
    }
    catch (e) { ok(true); }
});

test("LastOrDefault", function ()
{
    equal(arraySequence.LastOrDefault(-100), 10000);
    equal(arraySequence.LastOrDefault(-100, "$<=500"), 100);
    equal(arraySequence.LastOrDefault(-100, "$==-1"), -100);
    equal(emptySequence.LastOrDefault(-100), -100);
    equal(emptySequence.LastOrDefault(-100, "$==100"), -100);
});

test("Skip", function ()
{
    deepEqual(arraySequence.Skip(3).ToArray(), [1000, 10000]);
    deepEqual(arraySequence.Skip(-10).ToArray(), [1, 10, 100, 1000, 10000]);
    deepEqual(arraySequence.Skip(10).ToArray(), []);
    deepEqual(emptySequence.Skip(3).ToArray(), []);
});

test("TakeExceptLast", function ()
{
    deepEqual(arraySequence.TakeExceptLast().ToArray(), [1,10,100,1000]);
    deepEqual(arraySequence.TakeExceptLast(3).ToArray(), [1, 10]);
    deepEqual(arraySequence.TakeExceptLast(-100).ToArray(), [1, 10, 100, 1000, 10000]);
    deepEqual(arraySequence.TakeExceptLast(0).ToArray(), [1, 10, 100, 1000,10000]);
    deepEqual(arraySequence.TakeExceptLast(100).ToArray(), []);
});

test("TakeFromLast", function ()
{
    deepEqual(arraySequence.TakeFromLast(3).ToArray(), [100, 1000, 10000]);
    deepEqual(arraySequence.TakeFromLast(0).ToArray(), []);
    deepEqual(arraySequence.TakeFromLast(-100).ToArray(), []);
    deepEqual(arraySequence.TakeFromLast(100).ToArray(), [1, 10, 100, 1000, 10000]);
});

test("Reverse", function ()
{
    deepEqual(arraySequence.Reverse().ToArray(), [10000, 1000, 100, 10, 1]);
    deepEqual(emptySequence.Reverse().ToArray(), []);
});

test("SequenceEqual", function ()
{
    ok(arraySequence.SequenceEqual([1, 10, 100, 1000, 10000]));
    ok(!arraySequence.SequenceEqual([1, 10, 100, 1000, 10000, 100000]));
    ok(!arraySequence.SequenceEqual([1, 10, 100, 1000]));
    ok(!arraySequence.SequenceEqual([1, 10, 500, 1000, 10000]));
});

test("ToString", function ()
{
    equal(arraySequence.ToString(), "110100100010000");
    equal(arraySequence.ToString("-"), "1-10-100-1000-10000");
    equal(arraySequence.ToString("-", "$+1"), "2-11-101-1001-10001");
});