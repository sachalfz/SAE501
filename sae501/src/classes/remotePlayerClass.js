export class remotePlayer{
	constructor(clientPlayer, clientSocket){		
		const player = this;
		this.playerGroup = clientPlayer.group;
		this.socket = clientSocket;
		this.skinName = clientPlayer.skinName
		}
	
	initSocket(){
		//console.log("PlayerLocal.initSocket");
		this.socket.emit('init', { 
			// model:this.model, 
			// colour: this.colour,
			x: this.playerGroup.position.x,
			y: this.playerGroup.position.y,
			z: this.playerGroup.position.z,
			h: this.playerGroup.rotation.y,
			model: this.skinName,
			id: this.id,
			room: this.playerGroup.room,
			// pb: this.object.rotation.x
		});
		console.log('rmPlayer data initialised')
	}
	
	updateSocket(player){
		if (this.socket !== undefined){
			const playerGroup = player.group
			//console.log(`PlayerLocal.updateSocket - rotation(${this.object.rotation.x.toFixed(1)},${this.object.rotation.y.toFixed(1)},${this.object.rotation.z.toFixed(1)})`);
			this.socket.emit('update', {
				x: playerGroup.position.x,
				y: playerGroup.position.y,
				z: playerGroup.position.z,
				h: playerGroup.rotation.y,
				room: playerGroup.room,
				model: this.skinName,
				id: this.id,
				// pb: this.object.rotation.x,
				// action: this.action
			})
		}
	}
}