const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect to MongoDB!

mongo.connect('mongodb://127.0.0.1/mongomessenger', function(err, db){

	if(err){
		throw err;
	}

	console.log('MongoDB is connected.');
});