const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect to MongoDB!

mongo.connect('mongodb://127.0.0.1/mongomessenger', function(err, db){
	if(err){
		throw err;
	}

	console.log('MongoDB is connected.');

	// Connect to Socket.io
	client.on('connection', function(socket){
		let chat = db.collection('chats');

		// Send status to from client to server
		sendStatus = function(s){
			socket.emit('status', s);
		}

		// Get chat log from MongoDB
		chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
			if(err){
				throw err;
			}

			// Emit the messages
			socket.emit('output', res);

		});

		// Handle input events
		socket.on('input', function(data){
			let name = data.name;
			let message = data.message;

			// Check name and message
			if(name == '' || message == ''){
				// Send error
				sendStatus('Please enter a name and message.');
			}
			else{
				// Insert message
				chat.insert({name: name, message: message}, function(){
					client.emit('output', [data]);

					// Send status
					sendStatus({
						message: 'Message sent successfully.',
						clear: true
					});
				});
			}
		});

		// Handle clear
		socket.on('clear', function(data){
			// Remove all chats from collection
			chat.remove({}, function(){
				// Emit cleared
				socket.emit('cleared');
			});
		});
	});
});