var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("Aggregate");

var expected, actual; // will be removed

test("aggregate", function () {
    Enumerable.range(1, 10).aggregate("a,b=>a+b").is(55);
    Enumerable.range(1, 10).aggregate(10, "a,b=>a+b").is(65);
    Enumerable.range(1, 10).aggregate(10, "a,b=>a+b", "val=>val*10").is(650);

    Enumerable.range(1, 10).aggregate("", "s,x=>s+x", "'hoge' + $").is("hoge12345678910");
});

test("average", function () {
    Enumerable.range(1, 10).average().is(5.5);
    Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").average("t=>t.i").is(4.5);
});

test("count", function () {
    actual = Enumerable.range(1, 10).count();
    equal(actual, 10);
    actual = Enumerable.empty().count();
    equal(actual, 0);

    actual = Enumerable.range(1, 10).count("i=>i<5");
    equal(actual, 4);
});

test("Max", function () {
    actual = Enumerable.range(1, 10).max();
    equal(actual, 10);

    actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").max("t=>t.i");
    equal(actual, 9);
});

test("min", function () {
    actual = Enumerable.range(1, 10).min();
    equal(actual, 1);

    actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").min("t=>t.i");
    equal(actual, 0);
});

test("maxBy", function () {
    actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").maxBy("t=>t.i");
    deepEqual(actual, { v: 10, i: 9 });
});

test("minBy", function () {
    actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").minBy("t=>t.i");
    deepEqual(actual, { v: 1, i: 0 });
});

test("sum", function () {
    actual = Enumerable.range(1, 10).sum();
    equal(actual, 55);
    actual = Enumerable.empty().sum();
    equal(actual, 0);

    actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").sum("t=>t.i");
    equal(actual, 45);
});
