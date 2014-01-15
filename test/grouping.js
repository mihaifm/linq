/// <reference path="qunit.js"/>
/// <reference path="../linq.js" />
/// <reference path="../extensions/linq.qunit.js" />

module("Grouping");

var expected, actual; // will be removed

var fileList = ["temp.xls", "temp2.xls", "temp.pdf", "temp.jpg", "temp2.pdf", "temp3.xls"];

test("groupBy", function ()
{
    actual = Enumerable.from(fileList)
        .groupBy("file=>file.match(/\\.(.+$)/)[1]")
        .select("{key:$.key(),value:$.toArray()}")
        .toArray();
    expected = [{ key: "xls", value: ["temp.xls", "temp2.xls", "temp3.xls"] },
                { key: "pdf", value: ["temp.pdf", "temp2.pdf"] },
                { key: "jpg", value: ["temp.jpg"]}];
    deepEqual(actual, expected);

    actual = Enumerable.from(fileList)
        .groupBy("file=>file.match(/\\.(.+$)/)[1]", "file=>file.match(/(^.+)\\..+$/)[1]")
        .select("{key:$.key(),value:$.toArray()}")
        .toArray();
    expected = [{ key: "xls", value: ["temp", "temp2", "temp3"] },
                { key: "pdf", value: ["temp", "temp2"] },
                { key: "jpg", value: ["temp"]}];
    deepEqual(actual, expected);

    actual = Enumerable.from(fileList).groupBy("file=>file.match(/\\.(.+$)/)[1]",
        "file=>file",
        "ext,group => {extension:ext,count:group.count(),files:group.toArray()}")
        .toArray();
    expected = [{ extension: "xls", count: 3, files: ["temp.xls", "temp2.xls", "temp3.xls"] },
                { extension: "pdf", count: 2, files: ["temp.pdf", "temp2.pdf"] },
                { extension: "jpg", count: 1, files: ["temp.jpg"]}];
    deepEqual(actual, expected);

    var objects = [
        { Date: new Date(2000, 1, 1), Id: 1 },
        { Date: new Date(2010, 5, 5), Id: 2 },
        { Date: new Date(2000, 1, 1), Id: 3 }
    ]
    var actual = Enumerable.from(objects)
        .groupBy("$.Date", "$.Id",
            function (key, group) { return key.getFullYear() + "-" + group.toJoinedString(',') },
            function (key) { return key.toString() })
        .toArray();
    expected = ["2000-1,3", "2010-2"]
    deepEqual(actual, expected);
});

test("partitionBy", function ()
{
    actual = Enumerable.from(fileList)
        .partitionBy("file=>file.match(/\\.(.+$)/)[1]")
        .select("{key:$.key(),value:$.toArray()}")
        .toArray();
    expected = [{ key: "xls", value: ["temp.xls", "temp2.xls"] },
                { key: "pdf", value: ["temp.pdf"] },
                { key: "jpg", value: ["temp.jpg"] },
                { key: "pdf", value: ["temp2.pdf"] },
                { key: "xls", value: ["temp3.xls"] }
                ];
    deepEqual(actual, expected);

    actual = Enumerable.from(fileList)
        .partitionBy("file=>file.match(/\\.(.+$)/)[1]", "file=>file.match(/(^.+)\\..+$/)[1]")
        .select("{key:$.key(),value:$.toArray()}")
        .toArray();
    expected = [{ key: "xls", value: ["temp", "temp2"] },
                { key: "pdf", value: ["temp"] },
                { key: "jpg", value: ["temp"] },
                { key: "pdf", value: ["temp2"] },
                { key: "xls", value: ["temp3"] }
                ];
    deepEqual(actual, expected);

    actual = Enumerable.from(fileList)
        .partitionBy("file=>file.match(/\\.(.+$)/)[1]",
            "file=>file",
            "ext,group=>{extension:ext,count:group.count(),files:group.toArray()}")
        .toArray();
    expected = [{ extension: "xls", count: 2, files: ["temp.xls", "temp2.xls"] },
                { extension: "pdf", count: 1, files: ["temp.pdf"] },
                { extension: "jpg", count: 1, files: ["temp.jpg"] },
                { extension: "pdf", count: 1, files: ["temp2.pdf"] },
                { extension: "xls", count: 1, files: ["temp3.xls"] }
                ];
    deepEqual(actual, expected);

    var objects = [
        { Date: new Date(2000, 1, 1), Id: 1 },
        { Date: new Date(2000, 1, 1), Id: 2 },
        { Date: new Date(2010, 5, 5), Id: 3 },
        { Date: new Date(2000, 1, 1), Id: 4 },
        { Date: new Date(2010, 5, 5), Id: 5 },
        { Date: new Date(2010, 5, 5), Id: 6 }
    ]
    var actual = Enumerable.from(objects)
        .partitionBy("$.Date", "$.Id",
            function (key, group) { return key.getFullYear() + "-" + group.toJoinedString(',') },
            function (key) { return key.toString() })
        .toArray();
    expected = ["2000-1,2", "2010-3", "2000-4", "2010-5,6"]
    deepEqual(actual, expected);
});


test("buffer", function ()
{
    actual = Enumerable.range(1, 10).buffer("3").toArray();
    expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
    deepEqual(actual, expected);
});