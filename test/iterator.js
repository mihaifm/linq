import { test, testModule, deepEqual, equal } from './testutils.js'
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

test("from Generator", function () {
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

test("from Iterable object", function () {
    const map = new Map();

    map.set(1, 2);
    map.set(2, 4);

    deepEqual(Enumerable
            .from(map)
            .select(item => ({key: item[0], value: item[1]}))
            .select(item=>item.key)
            .toArray(),
        [1, 2]);

    let actual = [];
    for (var a of map) {
        actual.push(a[0]);
    }
    deepEqual(actual, [1, 2]);

    const set = new Set([1, 2, 3])
    equal(Enumerable.from(set).first(), 1)
});

test("from Iterator object", function () {
    const n = {
        // This is just a simple replacement for the data structure that needs to be traversed.
        // It may actually be a tree or other data structure implemented by a custom traversal.
        nums: [1, 2, 3],

        [Symbol.iterator]() {
            let idx = 0;
            return {
                next: () => {
                    if (idx < this.nums.length) {
                        return {
                            value: this.nums[idx++],
                            done: false,
                        };
                    } else return {
                        value: undefined,
                        done: true,
                    };
                },
            };
        }
    }

    deepEqual(Enumerable.from(n[Symbol.iterator]()).toArray(), [1, 2, 3]);

    let actual = [];
    for (var a of n) {
        actual.push(a);
    }
    deepEqual(actual, [1, 2, 3]);
});

test("reusable iterator", function () {
    const set = new Set([1, 2, 3])

    let a = Enumerable.from(set.entries());

    deepEqual(a.toArray(), [[1, 1], [2, 2], [3, 3]]);
    deepEqual(a.toArray(), []);

    let b = Enumerable.from(() => set.entries());

    deepEqual(b.toArray(), [[1, 1], [2, 2], [3, 3]]);
    deepEqual(b.toArray(), [[1, 1], [2, 2], [3, 3]]);

    let c = Enumerable.from(() => ['x', 'y', 'z']);

    deepEqual(c.toArray(), ['x', 'y', 'z']);
    deepEqual(c.toArray(), ['x', 'y', 'z']);
});
