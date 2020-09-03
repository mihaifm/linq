var {test, testModule, deepEqual, equal} = require('./testutils.js')
var Enumerable = require('../linq.min');

testModule("ErrorHandling");

test("catchError", function ()
{
    var msg;
    let actual = Enumerable.range(1, 10)
        .select(function (i)
        {
            if (i == 5) throw new Error("aiueo");
            return i;
        })
        .catchError(function (e)
        {
            msg = e.message;
        })
        .toArray();
    deepEqual(actual, [1, 2, 3, 4]);
    equal(msg,"aiueo");
});

test("finallyAction", function ()
{
    var msg;
    let actual = Enumerable.range(1, 10)
        .select(function (i)
        {
            if (i == 5) throw new Error("aiueo");
            return i;
        })
        .catchError(function (e)
        {
            msg = e.message;
        })
        .finallyAction(function (f)
        {
            msg += "f";
        })
        .toArray();
    deepEqual(actual, [1, 2, 3, 4]);
    equal(msg, "aiueof");
});
