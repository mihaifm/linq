import { test, testModule, deepEqual } from './testutils.js'
import Enumerable from '../linq.js'

testModule("WhereSelectEnumerable");

var seq = Enumerable.range(5, 10); // 5-14
var seq2 = Enumerable.range(5, 5); // 5-9

test("where", function () {
    deepEqual(seq.where("$%2==0").toArray(), [6, 8, 10, 12, 14]);
    deepEqual(seq.where("$$%2==0").toArray(), [5, 7, 9, 11, 13]);
});

test("select", function () {
    deepEqual(seq2.select("$*10").toArray(), [50, 60, 70, 80, 90]);
    deepEqual(seq2.select("$$*2").toArray(), [0, 2, 4, 6, 8]);
});

test("wherewhere", function () {
    deepEqual(seq.where("$%2==0").where("$%3==0").toArray(), [6, 12]);
    deepEqual(seq.where("$$%2==0").where("$$%2==0").toArray(), [5, 9, 13]);
    deepEqual(seq.where("$%2==0").where("$$%2==0").toArray(), [6, 10, 14]);
    deepEqual(seq.where("$$%2==0").where("$%3==0").toArray(), [9]);
});

test("selectselect", function () {
    deepEqual(seq2.select("$*10").select("$*2").toArray(), [100, 120, 140, 160, 180]);
    deepEqual(seq2.select("$$*2").select("$+$$*20").toArray(), [0, 22, 44, 66, 88]);
    deepEqual(seq2.select("$*10").select("$+$$*2").toArray(), [50, 62, 74, 86, 98]);
    deepEqual(seq2.select("$$*2").select("$*10").toArray(), [0, 20, 40, 60, 80]);
});

test("whereselect", function () {
    deepEqual(seq.where("$%2==0").select("$*2").toArray(), [12, 16, 20, 24, 28]);
    deepEqual(seq.where("$%2==0").select("$+$$*2").toArray(), [6, 10, 14, 18, 22]);
    deepEqual(seq.where("$$%2==0").select("$*2").toArray(), [10, 14, 18, 22, 26]);
    deepEqual(seq.where("$$%2==0").select("$+$$*2").toArray(), [5, 9, 13, 17, 21]);
});

test("selectwhere", function () {
    deepEqual(seq.select("$*2").where("$%2==0").toArray(), [10, 12, 14, 16, 18, 20, 22, 24, 26, 28]);
    deepEqual(seq.select("$+$$*2").where("$%2==0").toArray(), [8, 14, 20, 26, 32]);
    deepEqual(seq.select("$*2").where("$$%2==0").toArray(), [10, 14, 18, 22, 26]);
    deepEqual(seq.select("$+$$*2").where("$$%2==0").toArray(), [5, 11, 17, 23, 29]);
});

test("whereselectwhere", function () {
    deepEqual(seq.where("$%2==0").select("$*2").where("$%3==0").toArray(), [12, 24]);
    deepEqual(seq.where("$%2==0").select("$+$$*2").where("$$%2==0").toArray(), [6, 14, 22]);
    deepEqual(seq.where("$$%2==0").select("$*2").where("$$%2==0").toArray(), [10, 18, 26]);
    deepEqual(seq.where("$$%2==0").select("$+$$*2").where("$%3==0").toArray(), [9, 21]);
});

test("selectwhereselect", function () {
    deepEqual(seq.select("$*2").where("$%2==0").select("$*2").toArray(), [20, 24, 28, 32, 36, 40, 44, 48, 52, 56]);
    deepEqual(seq.select("$+$$*2").where("$%2==0").select("$$*2").toArray(), [0, 2, 4, 6, 8]);
    deepEqual(seq.select("$*2").where("$$%2==0").select("$*2+$$").toArray(), [20, 29, 38, 47, 56]);
    deepEqual(seq.select("$+$$*2").where("$$%2==0").select("$*2").toArray(), [10, 22, 34, 46, 58]);
});
