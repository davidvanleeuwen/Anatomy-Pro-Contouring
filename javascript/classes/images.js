var Images = Class.create({
	initialize: function(element, options) {
		this.element = $(element);
		this.options = Object.extend({
			
		}, options || {});
		
		this.images = this.element.down('.images').childElements();
		this.canvas = this.element.down('canvas');
		this.context = this.canvas.getContext("2d");
		
		this.images.each(function(image){
			image.hide();
		});
		
		this.slider = this.element.down('#slider');
		this.slider.value = 0;
		this.currentSlide = 0;
		this.color;
		this.startImages();
	},
	addObservers: function() {
		this.slider.observe('change', this.changeImage.bindAsEventListener(this));
		this.canvas.observe('mousedown', this.startLine.bindAsEventListener(this));
		this.canvas.observe('mouseup', this.endLine.bindAsEventListener(this));
		this.canvas.observe('mousemove', this.drawLine.bindAsEventListener(this));
		
		this.socket.on('connect', this.onConnect.bindAsEventListener(this));
		this.socket.on('message', this.onMessage.bindAsEventListener(this));
		this.socket.on('disconnect', this.onDisconnect.bindAsEventListener(this));
	},
	startImages: function() {
		this.images[this.currentSlide].show();
		this.socket = new io.Socket('localhost', {port: 3000});
		this.socket.connect();
		this.addObservers();
	},
	changeImage: function(event) {
		if(this.slider.value != this.currentSlide) {
			this.images[this.currentSlide].hide();
			this.images[this.slider.value].show();
			this.currentSlide = this.slider.value;
		}
	},
	startLine: function(event) {
		this.isDrawing = true;
		this.context.beginPath();
		this.context.strokeStyle = "rgba("+this.color.r+","+this.color.g+","+this.color.b+",1)";
		this.context.lineJoin = "round";
		this.context.lineWidth = 6;
		this.context.moveTo(event.clientX-this.canvas.offsetLeft, event.clientY-this.canvas.offsetTop);
		this.socket.send(JSON.stringify({moveTo: {slide: this.currentSlide, x: event.clientX-this.canvas.offsetLeft, y: event.clientY-this.canvas.offsetTop}}));
	},
	endLine: function(event) {
		this.isDrawing = false;
	},
	drawLine: function(event) {
		if(this.isDrawing) {
			this.context.lineTo(event.clientX-this.canvas.offsetLeft, event.clientY-this.canvas.offsetTop);
			this.socket.send(JSON.stringify({lineTo: {slide: this.currentSlide, x: event.clientX-this.canvas.offsetLeft, y: event.clientY-this.canvas.offsetTop}}));
			this.context.stroke();
		}
	},
	onConnect: function(response) {
		//this.socket.send(JSON.stringify({setColor}));
	},
	onMessage: function(message) {
		var msg = JSON.parse(message);
		if(msg.color) {
			this.color = msg.color;
		}
		if(msg.moveTo) {
			this.context.beginPath();
			this.context.moveTo(msg.moveTo.x, msg.moveTo.y);
		}
		if(msg.lineTo) {
			this.context.lineJoin = "round";
			this.context.strokeStyle = "rgba("+msg.lineTo.color.r+","+msg.lineTo.color.g+","+msg.lineTo.color.b+",1)";
			this.context.lineWidth = 6;
			this.context.lineTo(msg.lineTo.x, msg.lineTo.y);
			this.context.stroke();
		}
	},
	onDisconnect: function(response) {
		
	}
});