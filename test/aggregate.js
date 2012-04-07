var module = QUnit.module;
var Enumerable = require('../linq');

module("Aggregate");

test("Aggregate", function ()
{
    actual = Enumerable.Range(1, 10).Aggregate("a,b=>a+b");
    equal(actual, 55);

    actual = Enumerable.Range(1, 10).Aggregate(10, "a,b=>a+b");
    equal(actual, 65);

    actual = Enumerable.Range(1, 10).Aggregate(10, "a,b=>a+b", "val=>val*10");
    equal(actual, 650);
});

test("Average", function ()
{
    actual = Enumerable.Range(1, 10).Average();
    equal(actual, 5.5);

    actual = Enumerable.Range(1, 10).Select("v,i=>{v:v,i:i}").Average("t=>t.i");
    equal(actual, 4.5);
});

test("Count", function ()
{
    actual = Enumerable.Range(1, 10).Count();
    equal(actual, 10);
    actual = Enumerable.Empty().Count();
    equal(actual, 0);

    actual = Enumerable.Range(1, 10).Count("i=>i<5");
    equal(actual, 4);
});

test("Max", function ()
{
    actual = Enumerable.Range(1, 10).Max();
    equal(actual, 10);

    actual = Enumerable.Range(1, 10).Select("v,i=>{v:v,i:i}").Max("t=>t.i");
    equal(actual, 9);
});

test("Min", function ()
{
    actual = Enumerable.Range(1, 10).Min();
    equal(actual, 1);

    actual = Enumerable.Range(1, 10).Select("v,i=>{v:v,i:i}").Min("t=>t.i");
    equal(actual, 0);
});

test("MaxBy", function ()
{
    actual = Enumerable.Range(1, 10).Select("v,i=>{v:v,i:i}").MaxBy("t=>t.i");
    deepEqual(actual, { v: 10, i: 9 });
});

test("MinBy", function ()
{
    actual = Enumerable.Range(1, 10).Select("v,i=>{v:v,i:i}").MinBy("t=>t.i");
    deepEqual(actual, { v: 1, i: 0 });
});

test("Sum", function ()
{
    actual = Enumerable.Range(1, 10).Sum();
    equal(actual, 55);
    actual = Enumerable.Empty().Sum();
    equal(actual, 0);

    actual = Enumerable.Range(1, 10).Select("v,i=>{v:v,i:i}").Sum("t=>t.i");
    equal(actual, 45);
});