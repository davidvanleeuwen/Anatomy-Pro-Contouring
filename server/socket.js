var io = require('socket.io');

exports.bootSOCKET = function(app) {
	var socket = io.listen(app);
	
	socket.on('connection', function(client) {
		
		client.on('message', function(data) {
			try {
				var msg = JSON.parse(data);
			} catch(e) {}
			
			client.send(data);
			client.broadcast(data);
			
		});
		client.on('disconnect', function() {
			
		});	
	});
};
