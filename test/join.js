var module = QUnit.module;

module("Join");

test("Join", function ()
{
    var math = { yamada: 100, tanaka: 80, yoshida: 94 };
    var english = { yamada: 73, yoshida: 26, tanaka: 99 };
    actual = Enumerable.From(math)
        .Join(english, "outer=>outer.Key", "inner=>inner.Key",
            "o,i=>{Name:o.Key,Math:o.Value,English:i.Value}")
        .ToArray();
    expected = [{ Name: "yamada", Math: 100, English: 73 },
                { Name: "tanaka", Math: 80, English: 99 },
                { Name: "yoshida", Math: 94, English: 26}];
    deepEqual(actual, expected);

    actual = Enumerable.From(math)
        .Join(english, "outer=>outer", "inner=>inner",
            "o,i=>{Name:o.Key,Math:o.Value,English:i.Value}", "$.Key")
        .ToArray();
    expected = [{ Name: "yamada", Math: 100, English: 73 },
                { Name: "tanaka", Math: 80, English: 99 },
                { Name: "yoshida", Math: 94, English: 26}];
    deepEqual(actual, expected);
});

test("GroupJoin", function ()
{
    var array1 = [3, 3, 4, 5, 6];
    var array2 = [2, 4, 5, 6, 6];
    actual = Enumerable.From(array1)
        .GroupJoin(array2, " i => i", " i => i",
            function (outer, collection)
            {
                return {
                    outer: outer,
                    collection: collection.ToArray()
                }
            })
        .ToArray();
    expected = [{ outer: 3, collection: [] },
        { outer: 3, collection: [] },
        { outer: 4, collection: [4] },
        { outer: 5, collection: [5] },
        { outer: 6, collection: [6, 6]}];
    deepEqual(actual, expected);

    actual = Enumerable.From(array1)
        .GroupJoin(array2, " i => i", " i => i",
            function (outer, collection)
            {
                return {
                    outer: outer,
                    collection: collection.ToArray()
                }
            },
            function (key) { return key % 2 == 0; })
        .ToArray();
    expected = [{ outer: 3, collection: [5] },
                { outer: 3, collection: [5] },
                { outer: 4, collection: [2, 4, 6, 6] },
                { outer: 5, collection: [5] },
                { outer: 6, collection: [2, 4, 6, 6]}];
    deepEqual(actual, expected);
});