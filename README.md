# linq

This is a JavaScript implementation of the .NET [LINQ](https://msdn.microsoft.com/en-us/library/bb308959.aspx) library.

It contains all the original .NET methods plus a few additions.

Written in pure JavaScript with no dependencies.

## Examples

```js
// C# LINQ - delegate
Enumerable.Range(1, 10)
    .Where(delegate(int i) { return i % 3 == 0; })
    .Select(delegate(int i) { return i * 10; });

// linq.js - anonymous function
Enumerable.range(1, 10)
    .where(function(i) { return i % 3 == 0; })
    .select(function(i) { return i * 10; });
```

```js
// C# LINQ - lambda
Enumerable.Range(1, 10).Where((i) => i % 3 == 0).Select((i) => i * 10);

// linq.js - arrow function
Enumerable.range(1, 10).where((i) => i % 3 == 0).select((i) => i * 10);
```

```js
// C# LINQ - anonymous type
array.Select((val, i) => new { Value: val, Index: i }());

// linq.js - object literal
Enumerable.from(array).select((val, i) => ({ value: val, index: i }));
```

See [sample/tutorial.js](https://github.com/mihaifm/linq/blob/master/sample/tutorial.js) and the [test](https://github.com/mihaifm/linq/tree/master/test) folder for more examples.

# Usage

## Node.js (ES modules)

Install the latest version of the library with npm:

    npm install linq

Load it in your code with the `import` syntax:

```js
import Enumerable from 'linq'

let result = Enumerable.range(1, 10).where(i => i % 3 == 0).select(i => i * 10)
console.log(result.toArray()) // [ 30, 60, 90 ]
```

Because the library is an ES module, this code will only work if your project is also configured as an ES module. Add the following line in your `package.json` to make it an ES module:

```json
"type": "module"
```

If you're not planning to use ES modules, check the CommonJS section below.

## Node.js (CommonJS modules)

Install version 3 of this library:

    npm install linq@3

Load it with the `require` syntax:

```js
const Enumerable = require('linq')

let count = Enumerable.range(1, 10).count(i => i < 5)
console.log(count) // 4
```

The [cjs](https://github.com/mihaifm/linq/tree/cjs) branch contains the source code for the CommonJS version of the library.

## TypeScript

Install the latest version of the library with npm.

Configure your compiler options in `tsconfig.json`

```json
"compilerOptions": {
    "target": "ES2020",
    "moduleResolution": "node"
}
```

The library comes with a `d.ts` file containing type definitions for all the objects and methods, feel free to use them in your code:

```ts
import Enumerable from 'linq';

type tnum = Enumerable.IEnumerable<number>;
let x: tnum = Enumerable.from([1, 2, 3]);
```

## Deno

Import the library from deno.land. Use the `@deno-types` annotation to load type definitions:

```ts
// @deno-types="https://deno.land/x/linq@4.0.0/linq.d.ts"
import Enumerable from 'https://deno.land/x/linq@4.0.0/linq.js'

let radius = Enumerable.toInfinity(1).where(r => r * r * Math.PI > 10000).first()
```

You can also install locally with npm. Use the full file path when importing the library:

```ts
// @deno-types="./node_modules/linq/linq.d.ts"
import Enumerable from './node_modules/linq/linq.js'
```

## Browser

The minified version of the library is available in the [release](https://github.com/mihaifm/linq/releases/latest) archive.

Load it via `<script type="module">`:

```html
<script type="module" src="./linq.min.js"></script>
<script type="module">
    import Enumerable from './linq.min.js'
    Enumerable.from([1, 2, 3]).forEach(x => console.log(x))
</script>
```

You can also load the library via a CDN:

|        CDN | URL                                        |
| ---------: | :----------------------------------------- |
| unpkg      | <https://unpkg.com/linq/>                  |
| jsDelivr   | <https://jsdelivr.com/package/npm/linq>    |
| packd      | <https://bundle.run/linq@latest?name=linq> |

# Credits

[Yoshifumi Kawai](https://github.com/neuecc) developed the [original version](https://github.com/neuecc/linq.js/) of this library.

# License

[MIT License](https://github.com/mihaifm/linq/blob/master/LICENSE)
