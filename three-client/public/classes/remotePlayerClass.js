export class remotePlayer {
    constructor(clientPlayer, clientSocket) {
        this.playerGroup = clientPlayer.group;
        this.socket = clientSocket;
        this.skinName = clientPlayer.skinName;
        this.id = clientPlayer.id;
		this.isReady = clientPlayer.isReady;
		this.hasWon = clientPlayer.hasWon;
    }

    initSocket() {
        this.socket.emit('init', this.getPlayerData());
        console.log('rmPlayer data initialised');
    }

    updateSocket() {
        if (this.socket !== undefined) {
            this.socket.emit('update', this.getPlayerData());
        }
    }

    getPlayerData() {
        const playerGroup = this.playerGroup;
        return {
			id: this.id,
            x: playerGroup.position.x,
            y: playerGroup.position.y,
            z: playerGroup.position.z,
            h: playerGroup.rotation.y,
            room: playerGroup.room,
            model: this.skinName,
			isReady: this.isReady,
			hasWon: this.hasWon, 
        };
    }
}
