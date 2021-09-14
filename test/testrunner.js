import * as testutils from './testutils.js'

import './action.js'
import './aggregate.js'
import './arrayEnumerable.js'
import './convert.js'
import './dictionary.js'
import './enumerable.js'
import './errorHandling.js'
import './functional.js'
import './grouping.js'
import './iterator.js'
import './join.js'
import './ordering.js'
import './paging.js'
import './projection.js'
import './set.js'
import './whereSelectEnumerable.js'

testutils.runAll(false);

if (testutils.getFailedTests().length > 0)
    console.log(testutils.getFailedTests());
