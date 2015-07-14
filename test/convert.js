var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("Convert");

var expected, actual; // will be removed

test("toArray", function ()
{
    actual = Enumerable.range(1, 10).toArray();
    deepEqual(actual, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("toLookup", function ()
{
    var fileList = ["temp.xls", "temp2.xls", "temp.pdf", "temp.jpg", "temp2.pdf"];
    actual = Enumerable.from(fileList).toLookup("file=>file.match(/\\.(.+$)/)[1]");

    deepEqual(["temp.xls", "temp2.xls"], actual.get("xls").toArray());
    deepEqual(["temp.pdf", "temp2.pdf"], actual.get("pdf").toArray());
    deepEqual(["temp.jpg"], actual.get("jpg").toArray());
    equal(3, actual.count());
    ok(actual.contains("xls"));
    ok(!actual.contains("XLS"));
    var array = actual.toEnumerable().toArray();
    equal("xls", array[0].key());
    deepEqual(["temp.xls", "temp2.xls"], array[0].toArray());

    actual = Enumerable.from(fileList).toLookup("file=>file.match(/\\.(.+$)/)[1]", "file=>file +'ele'");
    deepEqual(["temp.xlsele", "temp2.xlsele"], actual.get("xls").toArray());
    deepEqual(["temp.pdfele", "temp2.pdfele"], actual.get("pdf").toArray());
    deepEqual(["temp.jpgele"], actual.get("jpg").toArray());

    fileList = ["temp.xls", "temp2.XLS", "temp.pdf", "temp.jpg", "temp2.pDf"];
    actual = Enumerable.from(fileList).toLookup("file=>file.match(/\\.(.+$)/)[1]", "file=>file +'ele'",
        function (s) { return s.toLowerCase() });
    deepEqual(actual.get("xLS").toArray(), ["temp.xlsele", "temp2.XLSele"]);
    deepEqual(actual.get("PDf").toArray(), ["temp.pdfele", "temp2.pDfele"]);
    deepEqual(actual.get("Jpg").toArray(), ["temp.jpgele"]);
    ok(actual.contains("xls"));
    ok(actual.contains("XLS"));
});

test("toObject", function ()
{
    actual = Enumerable.range(1, 3).toObject("i=>'foo'+i", "i=>i*4");
    deepEqual(actual, { foo1: 4, foo2: 8, foo3: 12 });
});


test("toDictionary", function ()
{
    actual = Enumerable.range(1, 3).toDictionary("i=>'foo'+i", "i=>i*4");
    equal(4, actual.get("foo1"));
    equal(8, actual.get("foo2"));
    equal(12, actual.get("foo3"));

    actual = Enumerable.range(1, 3).toDictionary("i=>{key:i,V:'foo'+i}", "i=>i*4", "$.key");
    equal(4, actual.get({ key: 1 }));
    equal(8, actual.get({ key: 2 }));
    equal(12, actual.get({ key: 3 }));
});

test("toJoinedString", function ()
{
    actual = Enumerable.range(1, 3).toJoinedString();
    equal(actual, "123");

    actual = Enumerable.range(1, 3).toJoinedString("-");
    equal(actual, "1-2-3");

    actual = Enumerable.range(1, 3).toJoinedString("-", "i=>i*2");
    equal(actual, "2-4-6");
});

test("toJSONString", function ()
{
    actual = Enumerable.from([{ a: 1, b: true }, { a: null, b: "aaa"}]).toJSONString();
    equal(actual, '[{"a":1,"b":true},{"a":null,"b":"aaa"}]');

    actual = Enumerable.range(1, 5).toJSONString();
    equal(actual, '[1,2,3,4,5]');

    actual = Enumerable.from(["a", "b", "c"])
        .toJSONString(function (key, value)
        {
            if (typeof value === 'object') return value;
            return value.toString().toUpperCase();
        });
    equal(actual, '["A","B","C"]');

    actual = Enumerable.from([1, 2, 3, 4, 5])
        .toJSONString(function (key, value) { return value; }, 1);
    ok(actual.indexOf("\n") != -1);
});
