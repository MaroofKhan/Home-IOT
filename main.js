var express  = require('express');
var app      = express();
var port     = parseInt(process.env.PORT) || 8080;

app.configure(function() {
	app.use(express.bodyParser());
	app.use(app.router);
})

require('./application/routes.js')(app);
app.listen(port);
console.log('On port# ' + port);