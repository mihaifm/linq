var module = QUnit.module;
var Enumerable = require('../linq');

module("ErrorHandling");

test("Catch", function ()
{
    var msg;
    actual = Enumerable.Range(1, 10)
        .Select(function (i)
        {
            if (i == 5) throw new Error("aiueo");
            return i;
        })
        .Catch(function (e)
        {
            msg = e.message;
        })
        .ToArray();
    deepEqual(actual, [1, 2, 3, 4]);
    equal(msg,"aiueo");
});

test("Finally", function ()
{
    var msg;
    actual = Enumerable.Range(1, 10)
        .Select(function (i)
        {
            if (i == 5) throw new Error("aiueo");
            return i;
        })
        .Catch(function (e)
        {
            msg = e.message;
        })
        .Finally(function (f)
        {
            msg += "f";
        })
        .ToArray();
    deepEqual(actual, [1, 2, 3, 4]);
    equal(msg, "aiueof");
});