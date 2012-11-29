var express = require('express');
var http = require('http');
var socket_io = require('socket.io');


exports.start = function(process){
	var app = express();
	var server = http.createServer(app);
	var io = socket_io.listen(server);

	// listen on port
	var port = process.env.PORT || 5000;
	server.listen(port, function() {
	  	console.log("Listening on " + port);
	});


	// serve static files for demo client
  	app.use(express.static(__dirname + '/../app'));


	// home route
	app.get('/', function (req, res) {
		res.sendfile(__dirname + '/../app/index.html');
	});


	// temp storage
	var storage = {};

	// clear temp storage after specified time
	clearing_storage();
	function clearing_storage(){
		setTimeout(function(){
			console.log('Clearing storage ..');

			var now_timestamp = new Date().getTime();
		
			for(document in storage){
				var difference = now_timestamp - storage[document].timestamp;
				if(difference > 1200000){
					delete storage[document];

					console.log("CLEANED document " + document);
				}
			}

			// rekursive calling same cleaning function
			clearing_storage();
		}, 60000);
	};

	// socket.io
	io.sockets.on('connection', function (socket) {
		// INIT
		socket.on('init', function (data) {
			if(storage[data.document] != undefined){
				var isIn = false;
				for(index in storage[data.document].clients)
					if(storage[data.document].clients[index] == socket.id){
						isIn = true;
						break;
					}

				if(isIn == false)
					storage[data.document].clients.push(socket.id);
			}else{
				storage[data.document] = {
					clients: [socket.id],
					syntax: "text",
					timestamp: new Date().getTime(),
					text: "Here your text"
				};
			}

			// emit state
			socket.emit('init', storage[data.document]);
		});

		// update code
		socket.on('updateText', function (data) {
			// save new text with last timestamp
			storage[data.document].text = data.text;
			storage[data.document].timestamp = new Date().getTime();

			// update texts to each client
			for(index in storage[data.document].clients){
				if(storage[data.document].clients[index] != socket.id)
					io.sockets.socket(storage[data.document].clients[index]).emit('updateText', storage[data.document]);
			}
		});


		// update syntax
		socket.on('updateSyntax', function (data) {
			// save new text
			storage[data.document].syntax = data.syntax;
			
			// update texts to each client
			for(index in storage[data.document].clients){
				if(storage[data.document].clients[index] != socket.id)
					io.sockets.socket(storage[data.document].clients[index]).emit('updateSyntax', storage[data.document].syntax);
			}
		});
	});

};
