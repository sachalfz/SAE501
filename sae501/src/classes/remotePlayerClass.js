export class remotePlayer {
    constructor(clientPlayer, clientSocket) {
        this.playerGroup = clientPlayer.group;
        this.socket = clientSocket;
        this.skinName = clientPlayer.skinName;
        this.id = clientPlayer.id;
    }

	initSocket(){
		//console.log("PlayerLocal.initSocket");
		this.socket.emit('init', { 
			// model:this.model, 
			// colour: this.colour,
            id: this.id,
			x: this.playerGroup.position.x,
			y: this.playerGroup.position.y,
			z: this.playerGroup.position.z,
			h: this.playerGroup.rotation.y,

            action: this.playerGroup.action,
			model: this.skinName,
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
                
                id: this.id,
				x: playerGroup.position.x,
				y: playerGroup.position.y,
				z: playerGroup.position.z,
				h: playerGroup.rotation.y,

                isReady:player.isReady,
                isDead:player.isDead,
                hasWon:player.hasWon,

				room: playerGroup.room,
				model: this.skinName,
				// pb: this.object.rotation.x,
				// action: this.action
			})
		}
	}
}
