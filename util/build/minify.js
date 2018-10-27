var compressor = require('node-minify');

// Using Google Closure
new compressor.minify({
    type: 'gcc',
    fileIn: 'linq.js',
    fileOut: 'linq.min.js',
    callback: function(err, min){
        console.log(err);
    }
});