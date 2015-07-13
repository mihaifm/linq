var module = QUnit.module;
var Enumerable = require('../linq.min');
require("../extensions/linq.qunit.js")({'Enumerable': Enumerable});

module("WhereSelectEnumerable");

var seq = Enumerable.range(5, 10); // 5-14
var seq2 = Enumerable.range(5, 5); // 5-9

test("where", function () {
    seq.where("$%2==0").is(6, 8, 10, 12, 14);
    seq.where("$$%2==0").is(5, 7, 9, 11, 13);
});

test("select", function () {
    seq2.select("$*10").is(50, 60, 70, 80, 90);
    seq2.select("$$*2").is(0, 2, 4, 6, 8);
});

test("wherewhere", function () {
    seq.where("$%2==0").where("$%3==0").is(6, 12);
    seq.where("$$%2==0").where("$$%2==0").is(5, 9, 13);
    seq.where("$%2==0").where("$$%2==0").is(6, 10, 14);
    seq.where("$$%2==0").where("$%3==0").is(9);
});

test("selectselect", function () {
    seq2.select("$*10").select("$*2").is(100, 120, 140, 160, 180);
    seq2.select("$$*2").select("$+$$*20").is(0, 22, 44, 66, 88);
    seq2.select("$*10").select("$+$$*2").is(50, 62, 74, 86, 98);
    seq2.select("$$*2").select("$*10").is(0, 20, 40, 60, 80);
});

test("whereselect", function () {
    seq.where("$%2==0").select("$*2").is(12, 16, 20, 24, 28);
    seq.where("$%2==0").select("$+$$*2").is(6, 10, 14, 18, 22);
    seq.where("$$%2==0").select("$*2").is(10, 14, 18, 22, 26);
    seq.where("$$%2==0").select("$+$$*2").is(5, 9, 13, 17, 21);
});

test("selectwhere", function () {
    seq.select("$*2").where("$%2==0").is(10, 12, 14, 16, 18, 20, 22, 24, 26, 28);
    seq.select("$+$$*2").where("$%2==0").is(8, 14, 20, 26, 32);
    seq.select("$*2").where("$$%2==0").is(10, 14, 18, 22, 26);
    seq.select("$+$$*2").where("$$%2==0").is(5, 11, 17, 23, 29);
});

test("whereselectwhere", function () {
    seq.where("$%2==0").select("$*2").where("$%3==0").is(12, 24);
    seq.where("$%2==0").select("$+$$*2").where("$$%2==0").is(6, 14, 22);
    seq.where("$$%2==0").select("$*2").where("$$%2==0").is(10, 18, 26);
    seq.where("$$%2==0").select("$+$$*2").where("$%3==0").is(9, 21);
});

test("selectwhereselect", function () {
    seq.select("$*2").where("$%2==0").select("$*2").is(20, 24, 28, 32, 36, 40, 44, 48, 52, 56);
    seq.select("$+$$*2").where("$%2==0").select("$$*2").is(0, 2, 4, 6, 8);
    seq.select("$*2").where("$$%2==0").select("$*2+$$").is(20, 29, 38, 47, 56);
    seq.select("$+$$*2").where("$$%2==0").select("$*2").is(10, 22, 34, 46, 58);
});
