var module = QUnit.module;

module("Grouping");

var fileList = ["temp.xls", "temp2.xls", "temp.pdf", "temp.jpg", "temp2.pdf", "temp3.xls"];

test("GroupBy", function ()
{
    actual = Enumerable.From(fileList)
        .GroupBy("file=>file.match(/\\.(.+$)/)[1]")
        .Select("{Key:$.Key(),Value:$.ToArray()}")
        .ToArray();
    expected = [{ Key: "xls", Value: ["temp.xls", "temp2.xls", "temp3.xls"] },
                { Key: "pdf", Value: ["temp.pdf", "temp2.pdf"] },
                { Key: "jpg", Value: ["temp.jpg"]}];
    deepEqual(actual, expected);

    actual = Enumerable.From(fileList)
        .GroupBy("file=>file.match(/\\.(.+$)/)[1]", "file=>file.match(/(^.+)\\..+$/)[1]")
        .Select("{Key:$.Key(),Value:$.ToArray()}")
        .ToArray();
    expected = [{ Key: "xls", Value: ["temp", "temp2", "temp3"] },
                { Key: "pdf", Value: ["temp", "temp2"] },
                { Key: "jpg", Value: ["temp"]}];
    deepEqual(actual, expected);

    actual = Enumerable.From(fileList).GroupBy("file=>file.match(/\\.(.+$)/)[1]",
        "file=>file",
        "ext,group => {extension:ext,count:group.Count(),files:group.ToArray()}")
        .ToArray();
    expected = [{ extension: "xls", count: 3, files: ["temp.xls", "temp2.xls", "temp3.xls"] },
                { extension: "pdf", count: 2, files: ["temp.pdf", "temp2.pdf"] },
                { extension: "jpg", count: 1, files: ["temp.jpg"]}];
    deepEqual(actual, expected);

    var objects = [
        { Date: new Date(2000, 1, 1), Id: 1 },
        { Date: new Date(2010, 5, 5), Id: 2 },
        { Date: new Date(2000, 1, 1), Id: 3 }
    ]
    var actual = Enumerable.From(objects)
        .GroupBy("$.Date", "$.Id",
            function (key, group) { return key.getFullYear() + "-" + group.ToString(',') },
            function (key) { return key.toString() })
        .ToArray();
    expected = ["2000-1,3", "2010-2"]
    deepEqual(actual, expected);
});

test("PartitionBy", function ()
{
    actual = Enumerable.From(fileList)
        .PartitionBy("file=>file.match(/\\.(.+$)/)[1]")
        .Select("{Key:$.Key(),Value:$.ToArray()}")
        .ToArray();
    expected = [{ Key: "xls", Value: ["temp.xls", "temp2.xls"] },
                { Key: "pdf", Value: ["temp.pdf"] },
                { Key: "jpg", Value: ["temp.jpg"] },
                { Key: "pdf", Value: ["temp2.pdf"] },
                { Key: "xls", Value: ["temp3.xls"] }
                ];
    deepEqual(actual, expected);

    actual = Enumerable.From(fileList)
        .PartitionBy("file=>file.match(/\\.(.+$)/)[1]", "file=>file.match(/(^.+)\\..+$/)[1]")
        .Select("{Key:$.Key(),Value:$.ToArray()}")
        .ToArray();
    expected = [{ Key: "xls", Value: ["temp", "temp2"] },
                { Key: "pdf", Value: ["temp"] },
                { Key: "jpg", Value: ["temp"] },
                { Key: "pdf", Value: ["temp2"] },
                { Key: "xls", Value: ["temp3"] }
                ];
    deepEqual(actual, expected);

    actual = Enumerable.From(fileList)
        .PartitionBy("file=>file.match(/\\.(.+$)/)[1]",
            "file=>file",
            "ext,group=>{extension:ext,count:group.Count(),files:group.ToArray()}")
        .ToArray();
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
    var actual = Enumerable.From(objects)
        .PartitionBy("$.Date", "$.Id",
            function (key, group) { return key.getFullYear() + "-" + group.ToString(',') },
            function (key) { return key.toString() })
        .ToArray();
    expected = ["2000-1,2", "2010-3", "2000-4", "2010-5,6"]
    deepEqual(actual, expected);
});


test("BufferWithCount", function ()
{
    actual = Enumerable.Range(1, 10).BufferWithCount("3").ToArray();
    expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
    deepEqual(actual, expected);
});