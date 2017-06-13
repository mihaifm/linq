## linq
This is a javascript implementation of the .NET [LINQ](https://msdn.microsoft.com/en-us/library/bb308959.aspx) library.

It contains all the origial .NET methods plus additional ones.

### Installation

    npm install linq

### Examples
```js
// C# LINQ - delegate
Enumerable.Range(1, 10)
    .Where(delegate(int i) { return i % 3 == 0; })
    .Select(delegate(int i) { return i * 10; });

// linq.js - anonymous function
Enumerable.Range(1, 10)
    .Where(function(i) { return i % 3 == 0; })
    .Select(function(i) { return i * 10; });
```

```js
// C# LINQ  - lambda
Enumerable.Range(1, 10).Where(i => i % 3 == 0).Select(i => i * 10);

// linq.js - lambda expression
Enumerable.Range(1, 10).Where("i => i % 3 == 0").Select("i => i * 10");
```

```js
// C# LINQ - anonymous type
array.Select((val, i) => new { Value = val, Index = i });

// linq.js - object literal
Enumerable.From(array).Select("val,i=>{Value:val, Index:i}");
```

See [sample/tutorial.js](https://github.com/mihaifm/linq/blob/master/sample/tutorial.js) for more examples.

### People

[Yoshifumi Kawai](https://github.com/neuecc) developed the [original version](http://linqjs.codeplex.com/) of this library, currently no longer maintained.

### License

[MIT License](http://opensource.org/licenses/MIT)
