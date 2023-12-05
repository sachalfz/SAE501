import * as THREE from 'three';
import { Capsule } from 'three/addons/math/Capsule.js';

export class Player {
    constructor(width, height, depth, skin) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.velocity = new THREE.Vector3();
        this.hitbox = this.createHitbox();
        this.collider = this.createCollider();
        this.skin = skin; // You can set this when loading the player's skin
        this.group = this.createPlayerGroup();
    }
  
    createHitbox() {
      const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
      const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
      const hitbox = new THREE.Mesh(geometry, material);
      return hitbox;
    }
  
    createCollider() {
      return new Capsule(
        new THREE.Vector3(0, this.height, 0), // Start position
        new THREE.Vector3(0, 0, 0), // End position
        this.width / 2 // Use half of player's width for the radius
      );
    }
  
    createPlayerGroup() {
        const group = new THREE.Group();
        group.add(this.hitbox);
        this.hitbox.visible = false;
        if (this.skin) {
          group.add(this.skin);
          this.hitbox.position.copy(this.collider.end);
          this.skin.position.copy(this.hitbox.position); // Set playerSkin position to match playerHitbox
          this.skin.position.y -= 0.2; // Adjust the y position to align with the top of the hitbox
        }
        return group;
    }
    

}  