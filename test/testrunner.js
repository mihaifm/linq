var tr = require("qunit");

var callback = function(err, report) {
    console.dir(report);
}
tr.run({
    code: "./linq.js",
    tests: "./test/linq.qunit-test.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/action.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/aggregate.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/arrayEnumerable.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/convert.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/dictionary.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/enumerable.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/errorHandling.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/functional.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/grouping.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/join.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/ordering.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/paging.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/projection.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/set.js"
}, callback);

tr.run({
    code: "./linq.js",
    tests: "./test/whereSelectEnumerable.js"
}, callback);
