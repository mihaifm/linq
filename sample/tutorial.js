var Enumerable = require('../linq');

/////////////////////////////
// Simple Lambda Expressions

console.log('# Simple Lambda Expressions\n');

// Anonymous function
Enumerable.range(1, 3).select(function(value, index) { return index + ':' + value }).log().toJoinedString();

// Arrow function syntax
Enumerable.range(1, 3).select((value, index) => index + ':' + value).log().toJoinedString();

// Lambdas can also be passed as strings
Enumerable.range(1, 3).select("(value, index) => index + '/' + value").log().toJoinedString();

// If the number of arguments is one, we can use default iterator variable '$'
Enumerable.range(1, 3).select("$*2").log().toJoinedString(); // same as i => i * 2

// "" is a shortcut for "x => x" (identity function)
Enumerable.range(4, 7).join(Enumerable.range(8, 5), "", "", (outer, inner) => outer * inner).log().toJoinedString();


///////////////////////////////
// Scope of lambda expressions

console.log('\n# Scope of lambda expressions\n');

// lambda expressions cannot access the closure when the string syntax is used
try {
  var number = 3;
  Enumerable.range(1,10).where("$ == number").log().toJoinedString();
} catch (e) {
  console.log("can't find number");
}

// use anonymous function to capture variable
Enumerable.range(1,10).where(function(i){return i == number}).log().toJoinedString();


/////////////////////////////
// Initializing from objects

console.log('\n# Initializing from objects\n');

var object = {foo:"a", "bar":100, "foobar":true};
Enumerable.from(object).forEach(function(obj) { console.log(obj.key + ":" + obj.value) });


/////////////////////////////////////
// Continue and break when iterating

console.log('\n# Continue and break when iterating\n');

Enumerable.repeat("foo", 10).forEach(function(value, index)
{
    if (index % 2 == 0) return; // continue
    if (index > 6) return false; // break
    console.log(index + ":" + value);
});


//////////////////////////////////
// Grouping and ref/value compare

console.log('\n# Grouping and ref/value compare\n');

// ref compare
console.log((new Date(2000, 1, 1) == new Date(2000, 1, 1))); // false
console.log(({ a: 0} == { a: 0 })); // false

console.log("------");
var objects = [
    { Date: new Date(2000, 1, 1), Id: 1 },
    { Date: new Date(2010, 5, 5), Id: 2 },
    { Date: new Date(2000, 1, 1), Id: 3 }
]

// ref compare, cannot do grouping
Enumerable.from(objects)
    .groupBy("$.Date", "$.Id",
        function (key, group) { return { date: key, ids: group.toJoinedString(',')} })
    .log("$.date + ':' + $.ids").toJoinedString();

console.log("------");

// use fourth argument to groupBy (compareSelector)
Enumerable.from(objects)
    .groupBy("$.Date", "$.Id",
        function (key, group) { return { date: key, ids: group.toJoinedString(',')} },
        function (key) { return key.toString() })
    .log("$.date + ':' + $.ids").toJoinedString();


//////////////////////////////
// Regular Expression matches

console.log('\n# Regular Expression matches\n');

// Enumerable.matches return Enumerable<MatchObject>

var input = "abcdefgABzDefabgdg";
Enumerable.matches(input, "ab(.)d", "i").forEach(function(match)
{
    for (var prop in match)
    {
        console.log(prop + " : " + match[prop]);
    }
    console.log("toString() : " + match.toString());
    console.log("---");
});


///////////////////////////////////
// LazyEvaluation and InfinityList

console.log('\n# LazyEvaluation and InfinityList\n');

// first radius of a circle with area over 10000
var result = Enumerable.toInfinity(1).where(r => r * r * Math.PI > 10000).first();
console.log(result);


//////////////
// Dictionary

console.log('\n# Dictionary\n');

// sample class
var cls = function (a, b)
{
    this.a = a;
    this.b = b;
}
var instanceA = new cls("a", 100);
var instanceB = new cls("b", 2000);

// create blank dictionary
var dict = Enumerable.empty().toDictionary();
// create blank dictionary (using compareSelector)
var dict = Enumerable.empty().toDictionary("","",function (x) { return x.a + x.b });

dict.add(instanceA, "zzz");
dict.add(instanceB, "huga");
console.log(dict.get(instanceA)); // zzz
console.log(dict.get(instanceB)); // huga

// enumerable (to keyvaluePair)
dict.toEnumerable().forEach(function (kvp)
{
    console.log(kvp.key.a + ":" + kvp.value);
});


/////////////////////////////
// Nondeterministic Programs

console.log('\n# Nondeterministic programs\n');

// a puzzle from Structure and Interpretation of Computer Programs
// http://sarabander.github.io/sicp/html/4_002e3.xhtml

var apart = Enumerable.range(1, 5);
var answers = apart
    .selectMany(function(baker){ return apart
    .selectMany(function(cooper){ return apart
    .selectMany(function(fletcher){ return apart
    .selectMany(function(miller){ return apart
    .select(function(smith){ return {
        baker: baker, cooper: cooper, fletcher: fletcher, miller: miller, smith: smith}})})})})})
    .where(function(x){ return Enumerable.from(x).distinct("$.value").count() == 5 })
    .where("$.baker != 5")
    .where("$.cooper != 1")
    .where("$.fletcher != 1 && $.fletcher != 5")
    .where("$.miller > $.cooper")
    .where("Math.abs($.smith - $.fletcher) != 1")
    .where("Math.abs($.fletcher - $.cooper) != 1");

answers.selectMany("").log("$.key + ':' + $.value").toJoinedString();
