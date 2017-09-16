var config = require('config-file');

var opts = config('./server/config/default.json');

console.log(__dirname + opts);

