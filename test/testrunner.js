var testutils = require('./testutils')

require('./action')
require('./aggregate')
require('./arrayEnumerable')
require('./convert')
require('./dictionary')
require('./enumerable')
require('./errorHandling')
require('./functional')
require('./grouping')
require('./iterator')
require('./join')
require('./ordering')
require('./paging')
require('./projection')
require('./set')
require('./whereSelectEnumerable')

testutils.runAll(false);

if (testutils.getFailedTests().length > 0)
    console.log(testutils.getFailedTests());
