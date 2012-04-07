var module = QUnit.module;
var Enumerable = require('../linq');

module("Paging");

test("ElementAt", function ()
{
    actual = Enumerable.Range(1, 10).ElementAt(5);
    equal(actual, 6);
});

test("ElementAtOrDefault", function ()
{
    actual = Enumerable.Range(1, 10).ElementAtOrDefault(3, "foo");
    equal(actual, 4);
    actual = Enumerable.Range(1, 10).ElementAtOrDefault(31, "foo");
    equal(actual, "foo");
});

test("First", function ()
{
    actual = Enumerable.Range(1, 10).First();
    equal(actual, 1);
    actual = Enumerable.Range(1, 10).First("i=>i*3==6");
    equal(actual, 2);
});

test("FirstOrDefault", function ()
{
    actual = Enumerable.Range(1, 10).FirstOrDefault(4);
    equal(actual, 1);
    actual = Enumerable.Range(1, 10).Skip(11).FirstOrDefault(4);
    equal(actual, 4);

    actual = Enumerable.Range(1, 10).FirstOrDefault(4, "i=>i*3==6");
    equal(actual, 2);
    actual = Enumerable.Range(1, 10).FirstOrDefault(40, "i=>i>13");
    equal(actual, 40);
});

test("Last", function ()
{
    actual = Enumerable.Range(1, 10).Last();
    equal(actual, 10);

    actual = Enumerable.Range(1, 10).Last("i=>i<6");
    equal(actual, 5);
});

test("LastOrDefault", function ()
{
    actual = Enumerable.Range(1, 10).LastOrDefault(34);
    equal(actual, 10);
    actual = Enumerable.Range(1, 10).Skip(11).LastOrDefault(34);
    equal(actual, 34);

    actual = Enumerable.Range(1, 10).LastOrDefault(4, "i=>i*3<=6");
    equal(actual, 2);
    actual = Enumerable.Range(1, 10).LastOrDefault(40, "i=>i>13");
    equal(actual, 40);
});

test("Single", function ()
{
    actual = Enumerable.Range(1, 1).Single();
    equal(actual, 1);

    actual = Enumerable.Range(1, 10).Single("i=>i==6");
    equal(actual, 6);
});

test("SingleOrDefault", function ()
{
    actual = Enumerable.Range(1, 1).SingleOrDefault(34);
    equal(actual, 1);
    actual = Enumerable.Range(1, 10).Skip(11).SingleOrDefault(34);
    equal(actual, 34);

    actual = Enumerable.Range(1, 10).SingleOrDefault(4, "i=>i*3==6");
    equal(actual, 2);
    actual = Enumerable.Range(1, 10).SingleOrDefault(40, "i=>i>13");
    equal(actual, 40);
});

test("Skip", function ()
{
    actual = Enumerable.Range(1, 10).Skip(4).ToArray();
    deepEqual(actual, [5, 6, 7, 8, 9, 10]);
});

test("SkipWhile", function ()
{
    actual = Enumerable.Range(1, 10).SkipWhile("i=>i<8").ToArray();
    deepEqual(actual, [8, 9, 10]);

    actual = Enumerable.Range(1, 10).SkipWhile("v,i=>i<8").ToArray();
    deepEqual(actual, [9, 10]);
});

test("Take", function ()
{
    actual = Enumerable.Range(1, 10).Take(4).ToArray();
    deepEqual(actual, [1, 2, 3, 4]);
});

test("TakeWhile", function ()
{
    actual = Enumerable.Range(1, 10).TakeWhile("i=>i<8").ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7]);

    actual = Enumerable.Range(1, 10).TakeWhile("v,i=>i<8").ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8]);
});

test("TakeExceptLast", function ()
{
    actual = Enumerable.Range(1, 10).TakeExceptLast().ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    actual = Enumerable.Range(1, 10).TakeExceptLast(3).ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7]);
    actual = Enumerable.Range(1, 10).TakeExceptLast(-1).ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    actual = Enumerable.Range(1, 10).TakeExceptLast(100).ToArray();
    deepEqual(actual, []);
});

test("TakeFromLast", function ()
{
    actual = Enumerable.Range(1, 10).TakeFromLast(3).ToArray();
    deepEqual(actual, [8, 9, 10]);
    actual = Enumerable.Range(1, 10).TakeFromLast(100).ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    actual = Enumerable.Range(1, 10).TakeFromLast(0).ToArray();
    deepEqual(actual, []);
    actual = Enumerable.Range(1, 10).TakeFromLast(-10).ToArray();
    deepEqual(actual, []);
});

test("IndexOf", function ()
{
    actual = Enumerable.Range(1, 10).IndexOf(3);
    equal(actual, 2);
});

test("LastIndexOf", function ()
{
    actual = Enumerable.From([1, 2, 3, 2, 5]).LastIndexOf(2)
    equal(actual, 3);
});