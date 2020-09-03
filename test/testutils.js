const assert = require('assert').strict;

var tests = []
var failedTests = []
var currentModule = "";
var numAssertions = 0;
var assertionIndex = 0;

function init() {
    tests = []
    numAssertions = 0
}

function test(name, run) {
    tests.push({name, run, module: currentModule})
}

function testModule(name) {
    currentModule = name;
}

function deepEqual(x, y) {
    numAssertions++
    assertionIndex++

    try {
        assert.deepEqual(x, y);
    }
    catch(e) {
        throw `[deepEqual] Assertion ${assertionIndex} failed`;
    }

    return true;
}

function notDeepEqual(x, y) {
    numAssertions++
    assertionIndex++

    try {
        assert.deepEqual(x, y);
    }
    catch(e) {
        return true;
    }

    throw `[deepEqual] Assertion ${assertionIndex} failed`;
}

function strictEqual(x, y) {
    numAssertions++
    assertionIndex++

    if (x === y)
        return true;

    throw `[deepEqual] Assertion ${assertionIndex} failed`;
}

function strictNotEqual(x, y) {
    numAssertions++
    assertionIndex++

    if (x !== y) 
        return true;

    throw `[strictNotEqual] Assertion ${assertionIndex} failed`;
}

function equal(x, y) {
    numAssertions++
    assertionIndex++

    if (x == y) 
        return true;
    
    throw `[equal] Assertion ${assertionIndex} failed`;
}

function notEqual(x, y) {
    numAssertions++
    assertionIndex++

    if (x != y)
        return true;

    throw `[notEqual] Assertion ${assertionIndex} failed`;
}

function ok(condition) {
    numAssertions++
    assertionIndex++

    if (condition == true)
        return true;

    throw `[ok] Assertion ${assertionIndex} failed`
}

function runAll(showExceptions) {
    tests.forEach(test => {
        try {
            assertionIndex = 0;
            test.run();
        }
        catch (e) {
            let info = { module: test.module, test: test.name, assertion: assertionIndex }
            failedTests.push(info);
            if (showExceptions) {
                console.log("Failed: ", info)
                throw e;
            }
        }
    })

    console.log(`Tests: ${tests.length}`)
    console.log(`Assertions: ${numAssertions}`)
    console.log(`Failed tests: ${failedTests.length}`)
}

function getFailedTests() {
    return failedTests;
}

module.exports = { init, test, testModule, getFailedTests, runAll, deepEqual, notDeepEqual, strictEqual, strictNotEqual, equal, notEqual, ok }
