var Connect = require('connect'),
	http = require('http');

	
var server = Connect.createServer();
server.listen(3000);

require('./socket').bootSOCKET(server);
