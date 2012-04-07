var module = QUnit.module;

module("Enumerable");

test("Choice", function ()
{
    actual = Enumerable.Choice(1, 10, 31, 42).Take(10).ToArray();
    notEqual(actual, [1, 10, 31, 42, 1, 10, 31, 42, 1, 10], "random test. if failed retry");
    equal(actual.length, 10);

    actual = Enumerable.Choice([1, 10, 31, 42]).Take(10).ToArray();
    notEqual(actual, [1, 10, 31, 42, 1, 10, 31, 42, 1, 10], "random test. if failed retry");
    equal(actual.length, 10);
});

test("Cycle", function ()
{
    actual = Enumerable.Cycle(1, 10, 31, 42).Take(10).ToArray();
    deepEqual(actual, [1, 10, 31, 42, 1, 10, 31, 42, 1, 10]);
    actual = Enumerable.Cycle([1, 2, 3, 4, 5]).Take(10).ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
});

test("Empty", function ()
{
    actual = Enumerable.Empty().ToArray();
    deepEqual(actual, []);
});

test("From", function ()
{
    actual = Enumerable.From("temp").ToArray();
    deepEqual(actual, ["t", "e", "m", "p"]);

    actual = Enumerable.From(3).ToArray();
    deepEqual(actual, [3]);

    actual = Enumerable.From([1, 2, 3, 4, 5]).ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5]);

    actual = Enumerable.From({ foo: "bar", func: function () { } }).ToArray();
    deepEqual(actual, [{ Key: "foo", Value: "bar"}]);
});

test("Return", function ()
{
    actual = Enumerable.Return("hoge").ToArray();
    deepEqual(actual, ["hoge"]);
});

test("Matches", function ()
{
    actual = Enumerable.Matches("xbcyBCzbc", /(.)bc/i).Select("$.index+$[1]").ToArray();
    deepEqual(actual, ["0x", "3y", "6z"]);
    actual = Enumerable.Matches("xbcyBCzbc", "(.)bc").Select("$.index+$[1]").ToArray(); ;
    deepEqual(actual, ["0x", "6z"]);
    actual = Enumerable.Matches("xbcyBCzbc", "(.)bc", "i").Select("$.index+$[1]").ToArray(); ;
    deepEqual(actual, ["0x", "3y", "6z"]);
});

test("Range", function ()
{
    actual = Enumerable.Range(1, 10).ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    actual = Enumerable.Range(1, 5, 3).ToArray();
    deepEqual(actual, [1, 4, 7, 10, 13]);
});

test("RangeDown", function ()
{
    actual = Enumerable.RangeDown(1, 10).ToArray();
    deepEqual(actual, [1, 0, -1, -2, -3, -4, -5, -6, -7, -8]);
    actual = Enumerable.RangeDown(1, 5, 3).ToArray();
    deepEqual(actual, [1, -2, -5, -8, -11]);
});

test("RangeTo", function ()
{
    actual = Enumerable.RangeTo(5, 10).ToArray();
    deepEqual(actual, [5, 6, 7, 8, 9, 10]);
    actual = Enumerable.RangeTo(1, 10, 3).ToArray();
    deepEqual(actual, [1, 4, 7, 10]);
    actual = Enumerable.RangeTo(-2, -8).ToArray();
    deepEqual(actual, [-2, -3, -4, -5, -6, -7, -8]);
    actual = Enumerable.RangeTo(-2, -8, 2).ToArray();
    deepEqual(actual, [-2, -4, -6, -8]);
});

test("Repeat", function ()
{
    actual = Enumerable.Repeat("temp").Take(3).ToArray();
    deepEqual(actual, ["temp", "temp", "temp"]);
    actual = Enumerable.Repeat("temp", 5).ToArray();
    deepEqual(actual, ["temp", "temp", "temp", "temp", "temp"]);
});

test("RepeatWithFinalize", function ()
{
    var fin;
    actual = Enumerable.RepeatWithFinalize(
                    function () { return "temp"; },
                    function () { fin = "final"; })
                .Take(3).ToArray();
    deepEqual(actual, ["temp", "temp", "temp"]);
    equal("final", fin);
});

test("Generate", function ()
{
    actual = Enumerable.Generate(function () { return "temp" }).Take(3).ToArray();
    deepEqual(actual, ["temp", "temp", "temp"]);
    actual = Enumerable.Generate(function () { return "temp" }, 5).ToArray();
    deepEqual(actual, ["temp", "temp", "temp", "temp", "temp"]);
});

test("ToInfinity", function ()
{
    actual = Enumerable.ToInfinity().Where("i=>i%2==0").Take(10).ToArray();
    deepEqual(actual, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
    actual = Enumerable.ToInfinity(101).Take(5).ToArray();
    deepEqual(actual, [101, 102, 103, 104, 105]);
    actual = Enumerable.ToInfinity(101, 5).Take(5).ToArray();
    deepEqual(actual, [101, 106, 111, 116, 121]);
});

test("ToNegativeInfinity", function ()
{
    actual = Enumerable.ToNegativeInfinity().Where("i=>i%2==0").Take(10).ToArray();
    deepEqual(actual, [0, -2, -4, -6, -8, -10, -12, -14, -16, -18]);
    actual = Enumerable.ToNegativeInfinity(3).Take(10).ToArray();
    deepEqual(actual, [3, 2, 1, 0, -1, -2, -3, -4, -5, -6]);
    actual = Enumerable.ToNegativeInfinity(3, 5).Take(4).ToArray();
    deepEqual(actual, [3, -2, -7, -12]);
});

test("Unfold", function ()
{
    actual = Enumerable.Unfold(5, "$+3").Take(5).ToArray();
    deepEqual(actual, [5, 8, 11, 14, 17]);
});