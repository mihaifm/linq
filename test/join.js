var {test, testModule, deepEqual} = require('./testutils.js')
var Enumerable = require('../linq.min');

testModule("Join");

test("join", function ()
{
    var math = { yamada: 100, tanaka: 80, yoshida: 94 };
    var english = { yamada: 73, yoshida: 26, tanaka: 99 };
    let actual = Enumerable.from(math)
        .join(english, "outer=>outer.key", "inner=>inner.key",
            "o,i=>{Name:o.key,Math:o.value,English:i.value}")
        .toArray();
    let expected = [{ Name: "yamada", Math: 100, English: 73 },
                    { Name: "tanaka", Math: 80, English: 99 },
                    { Name: "yoshida", Math: 94, English: 26}];
    deepEqual(actual, expected);

    actual = Enumerable.from(math)
        .join(english, "outer=>outer", "inner=>inner",
            "o,i=>{Name:o.key,Math:o.value,English:i.value}", "$.key")
        .toArray();
    expected = [{ Name: "yamada", Math: 100, English: 73 },
                { Name: "tanaka", Math: 80, English: 99 },
                { Name: "yoshida", Math: 94, English: 26}];
    deepEqual(actual, expected);

    actual = Enumerable.from(math)
        .join(english, "outer=>outer.key", "inner=>inner.key",
            "(o,i)=>{return {Name:o.key, Math:o.value, English:i.value}}")
        .toArray();

    expected = [{ Name: "yamada", Math: 100, English: 73 },
                { Name: "tanaka", Math: 80, English: 99 },
                { Name: "yoshida", Math: 94, English: 26}];

    deepEqual(actual, expected);

    actual = Enumerable.from(math)
        .join(english, "outer=>outer.key", "inner=>inner.key",
            "(o,i)=>{returnVal: o.key}")
        .toArray();

    expected = [{ returnVal: "yamada" }, { returnVal: "tanaka" }, { returnVal: "yoshida"}];

    deepEqual(actual, expected);
});

test("groupJoin", function ()
{
    var array1 = [3, 3, 4, 5, 6];
    var array2 = [2, 4, 5, 6, 6];
    let actual = Enumerable.from(array1)
        .groupJoin(array2, " i => i", " i => i",
            function (outer, collection)
            {
                return {
                    outer: outer,
                    collection: collection.toArray()
                }
            })
        .toArray();
    let expected = [{ outer: 3, collection: [] },
                    { outer: 3, collection: [] },
                    { outer: 4, collection: [4] },
                    { outer: 5, collection: [5] },
                    { outer: 6, collection: [6, 6]}];
    deepEqual(actual, expected);

    actual = Enumerable.from(array1)
        .groupJoin(array2, " i => i", " i => i",
            function (outer, collection)
            {
                return {
                    outer: outer,
                    collection: collection.toArray()
                }
            },
            function (key) { return key % 2 == 0; })
        .toArray();
    expected = [{ outer: 3, collection: [5] },
                { outer: 3, collection: [5] },
                { outer: 4, collection: [2, 4, 6, 6] },
                { outer: 5, collection: [5] },
                { outer: 6, collection: [2, 4, 6, 6]}];
    deepEqual(actual, expected);
});
