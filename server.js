import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'characters' directory
// app.use('/characters', express.static(path.join(__dirname, 'public', 'characters')));

// app.use('/characters', express.static(path.join(__dirname, 'characters')));

const connectedPlayers = []
io.sockets.on('connection', function(socket){
	console.log(`${socket.id} connected`);

    socket.userData = { x: 0, y: 0, z: 0, heading: 0, model: '' }; // Set a default value for the model
	// socket.onAny((eventName, ...args) => {
	// 	console.log(eventName); // 'hello'
	// 	console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ] 
	// });
	socket.emit('setId', { id:socket.id });
	
    socket.on('disconnect', function(){

		// Find the index of the disconnected player in the connectedPlayers array
		const index = connectedPlayers.findIndex(player => player.id === socket.id);

		// If the player is found, remove it using splice
		if (index !== -1) {
			connectedPlayers.splice(index, 1);
			console.log(connectedPlayers);

			// Emit an event or perform any other necessary actions
			io.emit('deletePlayer', { id: socket.id });

			console.log('Player disconnected:', socket.id);
		}

    });	
	
	socket.on('init', function(data){
        socket.userData.model = data.model
		socket.userData.x = data.x;
		socket.userData.y = data.y;
		socket.userData.z = data.z;
		socket.userData.heading = data.h;
		socket.userData.id = socket.id
		console.log(socket.userData);
		// socket.userData.pb = data.pb,
		// socket.userData.action = "Idle";
		connectedPlayers.push(socket.userData)
	});
	
	socket.on('update', function(data){
		const foundPlayer = connectedPlayers.find(item => item.id === data.id);

		if (foundPlayer) {
			// Update the values of the found player with the new data
			foundPlayer.x = data.x;
			foundPlayer.y = data.y;
			foundPlayer.z = data.z;
			foundPlayer.heading = data.h;
			foundPlayer.model = data.model;
			
			// console.log('Player with ID:', data.id, 'updated');
			// console.log(connectedPlayers)
		} else {
			// console.log('Player not found for ID:', data.id);
		}
	});
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

setInterval(function(){
    let pack = [];
    
    for (const player of connectedPlayers) {
        pack.push({
            id: player.id,
            x: player.x,
            y: player.y,
            z: player.z,
			model: player.model,
            heading: player.heading,
        });
    }

    if (pack.length > 0) io.emit('remoteData', pack);

}, 40);
