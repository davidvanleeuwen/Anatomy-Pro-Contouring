var io = require('socket.io');

exports.bootSOCKET = function(app) {
	var socket = io.listen(app);
	
	socket.on('connection', function(client) {
		
		var color = {
			r: randomNumber(255),
			g: randomNumber(255),
			b: randomNumber(255)
		};
		
		client.send(JSON.stringify({color: color }));
		
		client.on('message', function(data) {
			try {
				var msg = JSON.parse(data);
			} catch(e) {}
			
			//client.send(data);
			if(msg.lineTo) {
				client.broadcast(JSON.stringify({lineTo: {
					slide: msg.lineTo.slide,
					x: msg.lineTo.x,
					y: msg.lineTo.y,
					color: color
				}}));
			} else {
				client.broadcast(data);
			}
			
			
		});
		client.on('disconnect', function() {
			
		});	
	});
};

randomNumber = function(num) {
	return Math.floor(Math.random() * num);
};