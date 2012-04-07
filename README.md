## linq
[linq.js](http://linqjs.codeplex.com/) - LINQ for JavaScript library packaged for node.js

This contains only the core library without the jquery or rx bindings.

### Installation

    npm install linq

### Examples

    sample/tutorial.js

#### What's changed from the browser version?

Not much:

* Write and WriteLine functions modified to use `console.log` instead of `document.write`
* Minor changes to tests so they can be run on server side
* Sample tutorial is a .js file instead of .htm and can be run directly with node

#### License

[Microsoft Public License (Ms-PL)](https://raw.github.com/mihaifm/linq/master/LICENSE)