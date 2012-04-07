var module = QUnit.module;

module("Projection");

test("CascadeDepthFirst", function ()
{
    actual = Enumerable.Return(1).CascadeDepthFirst("$+$").Take(7).ToArray();
    deepEqual(actual, [1, 2, 4, 8, 16, 32, 64]);
    actual = Enumerable.Return(1).CascadeDepthFirst("$+$", "v,nl=>{v:v,nl:nl}").Take(3).ToArray();
    deepEqual(actual, [{ v: 1, nl: 0 }, { v: 2, nl: 1 }, { v: 4, nl: 2}]);
});

test("CascadeBreadthFirst", function ()
{
    actual = Enumerable.Return(1).CascadeBreadthFirst("$+$").Take(7).ToArray();
    deepEqual(actual, [1, 2, 4, 8, 16, 32, 64]);
    actual = Enumerable.Return(1).CascadeBreadthFirst("$+$", "v,nl=>{v:v,nl:nl}").Take(3).ToArray();
    deepEqual(actual, [{ v: 1, nl: 0 }, { v: 2, nl: 1 }, { v: 4, nl: 2}]);
});

test("Flatten", function ()
{
    var array = [1, 31, [431, 41, 5], [1431, 43, [344, 3], 43], 43];
    actual = Enumerable.From(array).Flatten().ToArray();
    deepEqual(actual, [1, 31, 431, 41, 5, 1431, 43, 344, 3, 43, 43]);
});

test("Pairwise", function ()
{
    actual = Enumerable.Range(1, 4).Pairwise("prev,next=>{p:prev,n:next}").ToArray();
    deepEqual(actual, [{ p: 1, n: 2 }, { p: 2, n: 3 }, { p: 3, n: 4}]);
});

test("Scan", function ()
{
    actual = Enumerable.Range(1, 10).Scan("a,b=>a+b").ToArray();
    deepEqual(actual, [1, 3, 6, 10, 15, 21, 28, 36, 45, 55]);
    var seed = 100;
    actual = Enumerable.Range(1, 10).Scan(seed, "a,b=>a+b").ToArray();
    deepEqual(actual, [100, 101, 103, 106, 110, 115, 121, 128, 136, 145, 155]);
    actual = Enumerable.Range(1, 10).Scan(seed, "a,b=>a+b", "val=>val*10").ToArray();
    deepEqual(actual, [1000, 1010, 1030, 1060, 1100, 1150, 1210, 1280, 1360, 1450, 1550]);
});

test("Select", function ()
{
    actual = Enumerable.Range(1, 10).Select("i=>i*10").ToArray();
    deepEqual(actual, [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    actual = Enumerable.Range(1, 10).Select("i,index=>i*10+index").ToArray();
    deepEqual(actual, [10, 21, 32, 43, 54, 65, 76, 87, 98, 109]);
});

test("SelectMany", function ()
{
    actual = Enumerable.Range(1, 5).SelectMany("i=>Enumerable.Repeat(i,2)").ToArray();
    deepEqual(actual, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    actual = Enumerable.Range(1, 5).SelectMany("i,index=>Enumerable.Repeat(i,index+1)").ToArray();
    deepEqual(actual, [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]);
    actual = Enumerable.Range(1, 5).SelectMany("i=>Enumerable.Repeat(i,2)", "i=>i*10").ToArray();
    deepEqual(actual, [10, 10, 20, 20, 30, 30, 40, 40, 50, 50]);
    actual = Enumerable.Range(1, 5).SelectMany("i,index=>Enumerable.Repeat(i,index+1)", "i=>i*10").ToArray();
    deepEqual(actual, [10, 20, 20, 30, 30, 30, 40, 40, 40, 40, 50, 50, 50, 50, 50]);
});

test("Where", function ()
{
    actual = Enumerable.Range(1, 10).Where("i=>i%2==0").ToArray();
    deepEqual(actual, [2, 4, 6, 8, 10]);
    actual = Enumerable.Range(1, 10).Where("i,index=>(i+index)%3==0").ToArray();
    deepEqual(actual, [2, 5, 8]);
});

test("OfType", function ()
{
    var seq = Enumerable.From([1, 2, "hoge", "3", 4, true]);
    deepEqual(seq.OfType(Number).ToArray(), [1, 2, 4]);
    deepEqual(seq.OfType(String).ToArray(), ["hoge", "3"]);
    deepEqual(seq.OfType(Boolean).ToArray(), [true]);

    var Cls = function (val) { this.val = val; }
    seq = Enumerable.From([new Cls("a"), new Cls("b"), 1, 2, new Cls("c"), 3]);
    deepEqual(seq.OfType(Cls).Select("$.val").ToArray(), ["a", "b", "c"]);
});

test("Zip", function ()
{
    actual = Enumerable.Range(1, 10).Zip(Enumerable.Range(20, 5), "outer,inner=>outer+inner").ToArray();
    deepEqual(actual, [21, 23, 25, 27, 29]);
    actual = Enumerable.Range(1, 10).Zip(Enumerable.Range(20, 5), "outer,inner,index=>outer+inner+index").ToArray();
    deepEqual(actual, [21, 24, 27, 30, 33]);
});