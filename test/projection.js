var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("Projection");

var expected, actual; // will be removed

test("traverseDepthFirst", function () {
    actual = Enumerable.make(1).traverseDepthFirst("$+$").take(7).toArray();
    deepEqual(actual, [1, 2, 4, 8, 16, 32, 64]);
    actual = Enumerable.make(1).traverseDepthFirst("$+$", "v,nl=>{v:v,nl:nl}").take(3).toArray();
    deepEqual(actual, [{ v: 1, nl: 0 }, { v: 2, nl: 1 }, { v: 4, nl: 2 }]);
});

test("traverseBreadthFirst", function () {
    actual = Enumerable.make(1).traverseBreadthFirst("$+$").take(7).toArray();
    deepEqual(actual, [1, 2, 4, 8, 16, 32, 64]);
    actual = Enumerable.make(1).traverseBreadthFirst("$+$", "v,nl=>{v:v,nl:nl}").take(3).toArray();
    deepEqual(actual, [{ v: 1, nl: 0 }, { v: 2, nl: 1 }, { v: 4, nl: 2 }]);
});

test("flatten", function () {
    var array = [1, 31, [431, 41, 5], [1431, 43, [344, 3], 43], 43];
    actual = Enumerable.from(array).flatten().toArray();
    deepEqual(actual, [1, 31, 431, 41, 5, 1431, 43, 344, 3, 43, 43]);
});

test("pairwise", function () {
    actual = Enumerable.range(1, 4).pairwise("prev,next=>{p:prev,n:next}").toArray();
    deepEqual(actual, [{ p: 1, n: 2 }, { p: 2, n: 3 }, { p: 3, n: 4 }]);
});

test("scan", function () {
    actual = Enumerable.range(1, 10).scan("a,b=>a+b").toArray();
    deepEqual(actual, [1, 3, 6, 10, 15, 21, 28, 36, 45, 55]);
    var seed = 100;
    actual = Enumerable.range(1, 10).scan(seed, "a,b=>a+b").toArray();
    deepEqual(actual, [100, 101, 103, 106, 110, 115, 121, 128, 136, 145, 155]);
});

test("select", function () {
    actual = Enumerable.range(1, 10).select("i=>i*10").toArray();
    deepEqual(actual, [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    actual = Enumerable.range(1, 10).select("i,index=>i*10+index").toArray();
    deepEqual(actual, [10, 21, 32, 43, 54, 65, 76, 87, 98, 109]);
});

test("selectMany", function () {
    actual = Enumerable.range(1, 5).selectMany("i=>this.repeat(i,2)").toArray();
    deepEqual(actual, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    actual = Enumerable.range(1, 5).selectMany("i,index=>this.repeat(i,index+1)").toArray();
    deepEqual(actual, [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]);
    actual = Enumerable.range(1, 5).selectMany("i=>this.repeat(i,2)", "i=>i*10").toArray();
    deepEqual(actual, [10, 10, 20, 20, 30, 30, 40, 40, 50, 50]);
    actual = Enumerable.range(1, 5).selectMany("i,index=>this.repeat(i,index+1)", "i=>i*10").toArray();
    deepEqual(actual, [10, 20, 20, 30, 30, 30, 40, 40, 40, 40, 50, 50, 50, 50, 50]);

    actual = Enumerable.range(1, 5)
                       .selectMany(function(i) { return Enumerable.repeat(i, 2); })
                       .toArray();
    deepEqual(actual, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    actual = Enumerable.range(1, 5)
                       .selectMany(function(i, index) { return Enumerable.repeat(i, index + 1); })
                       .toArray();
    deepEqual(actual, [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]);
    actual = Enumerable.range(1, 5)
                       .selectMany(function(i) { return Enumerable.repeat(i, 2); }, "i=>i*10")
                       .toArray();
    deepEqual(actual, [10, 10, 20, 20, 30, 30, 40, 40, 50, 50]);
    actual = Enumerable.range(1, 5)
                       .selectMany(function(i, index) { return Enumerable.repeat(i, index + 1); }, "i=>i*10")
                       .toArray();
    deepEqual(actual, [10, 20, 20, 30, 30, 30, 40, 40, 40, 40, 50, 50, 50, 50, 50]);
});

test("where", function () {
    actual = Enumerable.range(1, 10).where("i=>i%2==0").toArray();
    deepEqual(actual, [2, 4, 6, 8, 10]);
    actual = Enumerable.range(1, 10).where("i,index=>(i+index)%3==0").toArray();
    deepEqual(actual, [2, 5, 8]);
});

test("choose", function () {
    Enumerable.range(1, 10).choose(function (x) {
        return x % 2 == 0 ? null : x;
    }).is(1, 3, 5, 7, 9);

    Enumerable.range(1, 10).choose().is(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
});

test("ofType", function () {
    var seq = Enumerable.from([1, 2, "hoge", "3", 4, true]);
    deepEqual(seq.ofType(Number).toArray(), [1, 2, 4]);
    deepEqual(seq.ofType(String).toArray(), ["hoge", "3"]);
    deepEqual(seq.ofType(Boolean).toArray(), [true]);

    var Cls = function (val) { this.val = val; }
    seq = Enumerable.from([new Cls("a"), new Cls("b"), 1, 2, new Cls("c"), 3]);
    deepEqual(seq.ofType(Cls).select("$.val").toArray(), ["a", "b", "c"]);
});

test("zip", function () {
    actual = Enumerable.range(1, 10).zip(Enumerable.range(20, 5), "outer,inner=>outer+inner").toArray();
    deepEqual(actual, [21, 23, 25, 27, 29]);
    actual = Enumerable.range(1, 10).zip(Enumerable.range(20, 5), "outer,inner,index=>outer+inner+index").toArray();
    deepEqual(actual, [21, 24, 27, 30, 33]);
});

test("zip2", function () {
    [1, 2, 3]
        .zip(
            [-3, 4, 10],
            [5, 6, 7],
            function (x, y, z) { return x * y * z; })
        .is(-15, 48, 210);



    [1, 2, 3]
        .zip(
            [-3, 4, 10],
            [-3, 4, 10],
            function (x, y, z, i) { return i; })
        .is(0, 1, 2);

    [1, 2, 3]
        .zip(
            [-3, 4, 10],
            [-7, 20, 30, 100],
            function (x, y, z) { return x * y + z; })
        .is(-10, 28, 60);

    [1, 2, 3]
        .zip(
            [-3, 4, 10],
            [-7, 20, 30, 100],
            function (x, y, z, i) { return z + i; })
        .is(-7, 21, 32);

    Enumerable.from("abc").zip("fghk", "lmnopq", "stuv", "yz0124", "56780",
        function (a, b, c, d, e, f) { return a + b + c + d + e + f })
    .is("aflsy5", "bgmtz6", "chnu07");
});

test("merge", function () {


    [1, 2, 3].merge([-3, 4, 10]).is(1, -3, 2, 4, 3, 10);

    [1, 2, 3].merge([-3, 4], [-7, 20, 30, 100])
        .is(1, -3, -7, 2, 4, 20, 3, 30, 100);



});
