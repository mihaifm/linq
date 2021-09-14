import { test, testModule, deepEqual } from './testutils.js'
import Enumerable from '../linq.js'

testModule("Iterator");

test("for..of", function () {
    let actual = [];
    for (var a of Enumerable.from([1, 2, 3])) {
        actual.push(a);
    }
    deepEqual(actual, [1, 2, 3]);
});

test("Symbol.iterator", function ()
{
    let actual = [1,2,3,4];
    let expected = Array.from(Enumerable.from(actual));
    deepEqual(actual, expected);
    let actual2 = actual.map(function(x) { return x * 2 }); // [2,4,6,8];
    expected = Enumerable.from(actual).select(function(x) { return x * 2 });
    deepEqual(actual2, Array.from(expected));
});

test("from Iterable", function () {
    function* words() {
        yield "abc";
        yield "def";
    }

    deepEqual(Enumerable.from(words()).toArray(), ["abc", "def"]);

    let actual = [];
    for (var a of Enumerable.from(words())) {
        actual.push(a);
    }
    deepEqual(actual, ["abc", "def"]);
});
