var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;

require('./application/routes.js')(app);
app.listen(port);
console.log('On port# ' + port);