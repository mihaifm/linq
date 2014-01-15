// QUnit Extensions
// Method Chaning base assertion.

module.exports = (function (root) {
    if (root.Enumerable == null) {
        throw new Error("can't find Enumerable. linq.qunit.js must load after linq.js");
    }
    if ((Object.defineProperties == null)) {
        throw new Error("linq.qunit.js supports only defined 'Object.defineProperty' browser");
    }

    var Enumerable = root.Enumerable;
    Enumerable.Assert = {};

    // overwrite array
    Enumerable.Utils.extendTo(Array);

    // defProp helper, support only modern browser
    var defineToObject = function (methodName, value) {
        Object.defineProperty(Object.prototype, methodName, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
        });
    };

    var isCollection = function (obj) {
        if (obj instanceof Enumerable) return true;
        if (obj instanceof Array) return true;

        return false;
    };

    var executeCode = function (action) {
        try {
            action();
            return null;
        }
        catch (e) {
            return e;
        }
    };

    defineToObject("is", function (expected, message) {
        /// <signature>
        ///   <summary>strictEqual. if "this" is Array or Enumerable then deepEqual with expected and both normalized to array.</summary>
        ///   <param name="expected" type="Object">expected value</param>
        ///   <param name="message" type="String" optional="true">assertion message</param>
        ///   <returns type="void"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>collection deepEqual. argument is variable.</summary>
        ///   <param name="variableExpected" type="params Object[]">mulitple arguments. Usage: [1,2,3].is(1,2,3).</param>
        ///   <returns type="void"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>ok(true). expected function is passed actual. if result is true then ok.</summary>
        ///   <param name="expected" type="Func&lt;T,bool>">function checker, return boolean</param>
        ///   <param name="message" type="String" optional="true">assertion message</param>
        ///   <returns type="void"></returns>
        /// </signature>
        if (isCollection(this)) {
            if (arguments.length <= 2 && isCollection(expected)) {
                deepEqual(Enumerable.from(this).toArray(), Enumerable.from(expected).toArray(), message);
            }
            else {
                deepEqual(Enumerable.from(this).toArray(), Enumerable.from(arguments).toArray());
            }
        }
        else {
            if (expected instanceof Function) {
                ok(expected(this.valueOf()), message);
            }
            else {
                strictEqual(this.valueOf(), expected, message);
            }
        }
    });

    defineToObject("isNot", function (expected, message) {
        /// <signature>
        ///   <summary>notStrictEqual. if "this" is Array or Enumerable then notDeepEqual with expected and both normalized to array.</summary>
        ///   <param name="expected" type="Object">expected value.</param>
        ///   <param name="message" type="String" optional="true">assertion message.</param>
        ///   <returns type="void"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>collection notDeepEqual. argument is variable.</summary>
        ///   <param name="variableExpected" type="params Object[]">variable arguments. Usage: [1,2,3].isNot(-1,2,3).</param>
        ///   <returns type="void"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>ok(false). expected function pass actual. if result is false then ok.</summary>
        ///   <param name="expected" type="Func&lt;T,bool>">function checker, return boolean</param>
        ///   <param name="message" type="String" optional="true">assertion message</param>
        ///   <returns type="void"></returns>
        /// </signature>
        if (isCollection(this)) {
            if (arguments.length <= 2 && isCollection(expected)) {
                notDeepEqual(Enumerable.from(this).toArray(), Enumerable.from(expected).toArray(), message);
            }
            else {
                notDeepEqual(Enumerable.from(this).toArray(), Enumerable.from(arguments).toArray());
            }
        }
        else {
            if (expected instanceof Function) {
                ok(!expected(this.valueOf()), message);
            }
            else {
                notStrictEqual(this.valueOf(), expected, message);
            }
        }
    });

    defineToObject("isExpr", function (expression, message) {
        /// <summary>ok(true). string expression is converted lambda. lambda is passed actual. if result is true then ok.</summary>
        /// <param name="expression" type="String">expression string converted to function checker, lambda return boolean</param>
        /// <param name="message" type="String" optional="true">assertion message</param>
        /// <returns type="void"></returns>
        ok(Enumerable.Utils.createLambda(expression)(this.valueOf()), message);
    });

    defineToObject("isNotExpr", function (expression, message) {
        /// <summary>ok(false). string expression is converted lambda. lambda is passed actual. if result is false then ok.</summary>
        /// <param name="expression" type="String">expression string converted to function checker, lambda return boolean</param>
        /// <param name="message" type="String" optional="true">assertion message</param>
        /// <returns type="void"></returns>
        ok(!Enumerable.Utils.createLambda(expression)(this.valueOf()), message);
    });
    
    defineToObject("isTrue", function (message) {
        /// <summary>shorthand of is(true).</summary>
        /// <param name="message" type="String" optional="true">assertion message.</param>
        /// <returns type="void"></returns>
        this.is(true, message);
    });

    defineToObject("isFalse", function (message) {
        /// <summary>shorthand of is(false).</summary>
        /// <param name="message" type="String" optional="true">assertion message.</param>
        /// <returns type="void"></returns>
        this.is(false, message);
    });

    Enumerable.Assert.expectError = function (testAction, message) {
        /// <summary>Throw error in testCode.</summary>
        /// <param name="testCode" type="Action">action function.</param>
        /// <param name="message" type="String" optional="true">assertion message.</param>
        /// <returns type="Error"></returns>
        var error = executeCode(testAction);

        if (error != null) {
            ok(true, message);
        }
        else {
            ok(false, "Failed testCode does not throw error." + ((message != null) ? " Message:" + message : ""));
        }

        return error;
    };

    defineToObject("doesNotThrow", function (testAction, message) {
        /// <summary>Does not throw error in testCode.</summary>
        /// <param name="testCode" type="Function">action function.</param>
        /// <param name="message" type="String" optional="true">assertion message.</param>
        /// <returns type="void"></returns>
        var error = executeCode(testAction);

        if (error != null) {
            ok(false, "Failed testCode throws error. CatchedErrorMessage:" + error.message + ((message != null) ? " Message:" + message : ""));
        }
    });
});
