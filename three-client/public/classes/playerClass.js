import * as THREE from 'three';
import { Capsule } from 'three/addons/math/Capsule.js';


export class Player {
    constructor(skin, skinName, actions) {
        this.width = 0.6;
        this.height = 1.51;
        this.depth = 1;
        this.velocity = new THREE.Vector3();
        this.hitbox = this.createHitbox();
        this.collider = this.createCollider();
        this.skin = skin; // You can set this when loading the player's skin
        this.actions = actions; // You can set this when loading the player's skin
        this.group = this.createPlayerGroup();
        this.skinName = skinName;
        this.isReady = false;
        this.hasWon = false;
        this.action = false;
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
