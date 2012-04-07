var Enumerable = require('../linq');

/////////////////////////////////
//First step of Lambda Expression

console.log('\nFirst step of Lambda Expression\n');

// Anonymous function
Enumerable.Range(1, 3).Select(function(value, index) { return index + ':' + value }).WriteLine();
// String like Lambda Expression (arguments => expression)
Enumerable.Range(1, 3).Select("value,index=>index+':'+value").WriteLine();

// If the number of arguments is one , can use default iterator variable '$'
Enumerable.Range(1, 3).Select("i=>i*2").WriteLine();
Enumerable.Range(1, 3).Select("$*2").WriteLine(); // same

// "" is shortcut of "x => x" (identity function)
Enumerable.Range(4, 7).Join(Enumerable.Range(8, 5), "", "", "outer,inner=>outer*inner").WriteLine();



/////////////////////////////
//Scope of lambda expression

console.log('\nScope of lambda expression\n');

var number = 3;
// Can't Find number | lambda expression can use only global variable
// Enumerable.Range(1,10).Where("$ == number").WriteLine();

// use anonymous founction, can capture variable
Enumerable.Range(1,10).Where(function(i){return i == number}).WriteLine();



//////////////////////////////////////////
//From(Object) -> convert to KeyValuePair

console.log('\nFrom(Object) -> convert to KeyValuePair\n');

var object = {foo:"a", "bar":100, "foobar":true};
Enumerable.From(object).ForEach(function(obj)
{
    console.log(obj.Key + ":" + obj.Value);
});



//////////////////////////////
//ForEach (continue and break)

console.log('\nForEach (continue and break)\n');

Enumerable.Repeat("foo", 10).ForEach(function(value, index)
{
    if (index % 2 == 0) return; // continue
    if (index > 6) return false; // break
    console.log(index + ":" + value);
});



/////////////////////////////////
//Grouping and ref/value compare

console.log('\nGrouping and ref/value comparen\n');

// ref compare
console.log((new Date(2000, 1, 1) == new Date(2000, 1, 1))); // false
console.log(({ a: 0} == { a: 0 })); // false

console.log("------");
var objects = [
    { Date: new Date(2000, 1, 1), Id: 1 },
    { Date: new Date(2010, 5, 5), Id: 2 },
    { Date: new Date(2000, 1, 1), Id: 3 }
]

// ref compare, can not grouping
Enumerable.From(objects)
    .GroupBy("$.Date", "$.Id",
        function (key, group) { return { date: key, ids: group.ToString(',')} })
    .WriteLine("$.date + ':' + $.ids");

console.log("------");

// use fourth argument(compareSelector)
Enumerable.From(objects)
    .GroupBy("$.Date", "$.Id",
        function (key, group) { return { date: key, ids: group.ToString(',')} },
        function (key) { return key.toString() })
    .WriteLine("$.date + ':' + $.ids");



//////////////////////////////
//Regular Expression Matches

console.log('\nRegular Expression Matches\n');

// Enumerable.Matches return Enumerable<MatchObject>

var input = "abcdefgABzDefabgdg";
Enumerable.Matches(input, "ab(.)d", "i").ForEach(function(match)
{
    for (var prop in match)
    {
        console.log(prop + " : " + match[prop]);
    }
    console.log("toString() : " + match.toString());
    console.log("---");
});



//////////////////////////////////
//LazyEvaluation and InfinityList

console.log('\nLazyEvaluation and InfinityList\n');

// first radius of circle's area over 10000
var result = Enumerable.ToInfinity(1).Where("r=>r*r*Math.PI>10000").First();
console.log(result);



/////////////
//Dictionary

console.log('\nDictionary\n');

// sample class
var cls = function (a, b)
{
    this.a = a;
    this.b = b;
}
var instanceA = new cls("a", 100);
var instanceB = new cls("b", 2000);

// create blank dictionary
var dict = Enumerable.Empty().ToDictionary();
// create blank dictionary(use compareSelector)
var dict = Enumerable.Empty().ToDictionary("","",function (x) { return x.a + x.b });

dict.Add(instanceA, "zzz");
dict.Add(instanceB, "huga");
console.log(dict.Get(instanceA)); // zzz
console.log(dict.Get(instanceB)); // huga

// enumerable (to KeyValuePair)
dict.ToEnumerable().ForEach(function (kvp)
{
    console.log(kvp.Key.a + ":" + kvp.Value);
});



/////////////////////////////////////////////
//Nondeterministic Programs

console.log('\nNondeterministic Programs\n');

// from Structure and Interpretation of Computer Programs 4.3.2
var apart = Enumerable.Range(1, 5);
var answers = apart
    .SelectMany(function(baker){ return apart
    .SelectMany(function(cooper){ return apart
    .SelectMany(function(fletcher){ return apart
    .SelectMany(function(miller){ return apart
    .Select(function(smith){ return {
        baker: baker, cooper: cooper, fletcher: fletcher, miller: miller, smith: smith}})})})})})
    .Where("Enumerable.From($).Distinct('$.Value').Count() == 5")
    .Where("$.baker != 5")
    .Where("$.cooper != 1")
    .Where("$.fletcher != 1 && $.fletcher != 5")
    .Where("$.miller > $.cooper")
    .Where("Math.abs($.smith - $.fletcher) != 1")
    .Where("Math.abs($.fletcher - $.cooper) != 1");

answers.SelectMany("").WriteLine("$.Key + ':' + $.Value");