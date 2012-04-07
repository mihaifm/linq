var module = QUnit.module;
var Enumerable = require('../linq');

module("Convert");

test("ToArray", function ()
{
    actual = Enumerable.Range(1, 10).ToArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("ToLookup", function ()
{
    var fileList = ["temp.xls", "temp2.xls", "temp.pdf", "temp.jpg", "temp2.pdf"];
    actual = Enumerable.From(fileList).ToLookup("file=>file.match(/\\.(.+$)/)[1]");

    deepEqual(["temp.xls", "temp2.xls"], actual.Get("xls").ToArray());
    deepEqual(["temp.pdf", "temp2.pdf"], actual.Get("pdf").ToArray());
    deepEqual(["temp.jpg"], actual.Get("jpg").ToArray());
    equal(3, actual.Count());
    ok(actual.Contains("xls"));
    ok(!actual.Contains("XLS"));
    var array = actual.ToEnumerable().ToArray();
    equal("xls", array[0].Key());
    deepEqual(["temp.xls", "temp2.xls"], array[0].ToArray());

    actual = Enumerable.From(fileList).ToLookup("file=>file.match(/\\.(.+$)/)[1]", "file=>file +'ele'");
    deepEqual(["temp.xlsele", "temp2.xlsele"], actual.Get("xls").ToArray());
    deepEqual(["temp.pdfele", "temp2.pdfele"], actual.Get("pdf").ToArray());
    deepEqual(["temp.jpgele"], actual.Get("jpg").ToArray());

    fileList = ["temp.xls", "temp2.XLS", "temp.pdf", "temp.jpg", "temp2.pDf"];
    actual = Enumerable.From(fileList).ToLookup("file=>file.match(/\\.(.+$)/)[1]", "file=>file +'ele'",
        function (s) { return s.toLowerCase() });
    deepEqual(actual.Get("xLS").ToArray(), ["temp.xlsele", "temp2.XLSele"]);
    deepEqual(actual.Get("PDf").ToArray(), ["temp.pdfele", "temp2.pDfele"]);
    deepEqual(actual.Get("Jpg").ToArray(), ["temp.jpgele"]);
    ok(actual.Contains("xls"));
    ok(actual.Contains("XLS"));
});

test("ToObject", function ()
{
    actual = Enumerable.Range(1, 3).ToObject("i=>'foo'+i", "i=>i*4");
    deepEqual(actual, { foo1: 4, foo2: 8, foo3: 12 });
});


test("ToDictionary", function ()
{
    actual = Enumerable.Range(1, 3).ToDictionary("i=>'foo'+i", "i=>i*4");
    equal(4, actual.Get("foo1"));
    equal(8, actual.Get("foo2"));
    equal(12, actual.Get("foo3"));

    actual = Enumerable.Range(1, 3).ToDictionary("i=>{Key:i,V:'foo'+i}", "i=>i*4", "$.Key");
    equal(4, actual.Get({ Key: 1 }));
    equal(8, actual.Get({ Key: 2 }));
    equal(12, actual.Get({ Key: 3 }));
});

test("ToString", function ()
{
    actual = Enumerable.Range(1, 3).ToString();
    equal(actual, "123");

    actual = Enumerable.Range(1, 3).ToString("-");
    equal(actual, "1-2-3");

    actual = Enumerable.Range(1, 3).ToString("-", "i=>i*2");
    equal(actual, "2-4-6");
});

test("ToJSON", function ()
{
    actual = Enumerable.From([{ a: 1, b: true }, { a: null, b: "aaa"}]).ToJSON();
    equal(actual, '[{"a":1,"b":true},{"a":null,"b":"aaa"}]');

    actual = Enumerable.Range(1, 5).ToJSON();
    equal(actual, '[1,2,3,4,5]');

    actual = Enumerable.From(["a", "b", "c"])
        .ToJSON(function (key, value)
        {
            if (typeof value === 'object') return value;
            return value.toString().toUpperCase();
        });
    equal(actual, '["A","B","C"]');

    actual = Enumerable.From([1, 2, 3, 4, 5])
        .ToJSON(function (key, value) { return value; }, 1);
    ok(actual.indexOf("\n") != -1);
});