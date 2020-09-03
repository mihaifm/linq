var {test, testModule, deepEqual, strictEqual, equal} = require('./testutils.js')
var Enumerable = require('../linq.min');

testModule("Aggregate");

test("aggregate", function () {
    strictEqual(Enumerable.range(1, 10).aggregate("a,b=>a+b"), 55);
    strictEqual(Enumerable.range(1, 10).aggregate(10, "a,b=>a+b"), 65);
    strictEqual(Enumerable.range(1, 10).aggregate(10, "a,b=>a+b", "val=>val*10"), 650);
    strictEqual(Enumerable.range(1, 10).aggregate("", "s,x=>s+x", "'hoge' + $"), "hoge12345678910");
});

test("average", function () {
    strictEqual(Enumerable.range(1, 10).average(), 5.5);
    strictEqual(Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").average("t=>t.i"), 4.5);
});

test("count", function () {
    let actual = Enumerable.range(1, 10).count();
    equal(actual, 10);
    actual = Enumerable.empty().count();
    equal(actual, 0);

    actual = Enumerable.range(1, 10).count("i=>i<5");
    equal(actual, 4);
});

test("Max", function () {
    let actual = Enumerable.range(1, 10).max();
    equal(actual, 10);

    actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").max("t=>t.i");
    equal(actual, 9);
});

test("min", function () {
    let actual = Enumerable.range(1, 10).min();
    equal(actual, 1);

    actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").min("t=>t.i");
    equal(actual, 0);
});

test("maxBy", function () {
    let actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").maxBy("t=>t.i");
    deepEqual(actual, { v: 10, i: 9 });
});

test("minBy", function () {
    let actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").minBy("t=>t.i");
    deepEqual(actual, { v: 1, i: 0 });
});

test("sum", function () {
    let actual = Enumerable.range(1, 10).sum();
    equal(actual, 55);
    actual = Enumerable.empty().sum();
    equal(actual, 0);

    actual = Enumerable.range(1, 10).select("v,i=>{v:v,i:i}").sum("t=>t.i");
    equal(actual, 45);
});
