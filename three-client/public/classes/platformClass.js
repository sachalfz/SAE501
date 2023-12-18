import * as THREE from 'three';

export class Platform extends THREE.Object3D {
    constructor(width, height, depth, imagePath, position) {
        super();

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.imagePath = imagePath;

        // Create the platform mesh and set its position
        this.mesh = this.createPlatformWithImage(position);

        // Add the platform mesh to the Platform object
        this.add(this.mesh);
    }

    createPlatformWithImage(position) {
        const textureLoader = new THREE.TextureLoader().setPath('./covers/');
        const texture = textureLoader.load(this.imagePath);
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const platformMesh = new THREE.Mesh(geometry, material);

        platformMesh.castShadow = true;
        platformMesh.receiveShadow = true;
        platformMesh.position.set(position.x, position.y, position.z); // Set the position here

        return platformMesh;
    }
}
