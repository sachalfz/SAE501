<template>
    <div class="threedcanvas" id="webgl"></div>
</template>

<script>
import { createScene } from '../script/client.js';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { apiUserInventory } from '@/main.js';

export default {
  computed: {
    // Utilisation de la valeur calculée user provenant du script setup
    user() {
      const store = useStore();
      return computed(() => store.state.user).value;
    },
  },
  data() {
    return {
      streamzWin: 500,
      currentUser: null
    };
  },
  mounted() {
    this.createThree();
    window.addEventListener('victory', this.handleVictory);

    this.currentUser = this.user;
  },
  methods: {
    async createThree() {
      await createScene();
    },
    handleVictory(event) {
      const victory = event.detail.victory;
      if (victory) {
        console.log('Victory happened!');
        this.addToStats(this.streamzWin);
      }
    },
    async addToStats(streamz) {
      try {
      if (this.currentUser) {
        const updatedUser = {
          "streamz": this.currentUser.inventory.streamz + streamz,
          "items": this.currentUser.inventory.items,
          "username": this.currentUser.inventory.username,
          "profilepicture": this.currentUser.inventory.profilepicture,
          "gameswon": this.currentUser.inventory.gameswon,
          "gamesplayed": this.currentUser.inventory.gamesplayed,
          "user": `${apiUserInventory}/api/users/${this.currentUser.id}`,
        };

        fetch(`${apiUserInventory}/api/inventories/${this.user.inventory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/ld+json',
          },
          body: JSON.stringify(updatedUser),
        })
          .then(response => response.json())
          .then(data => {
            this.user.inventory = data;
            this.$store.commit('setUser', this.user);
            console.log('User inventory updated successfully:', data);
          })
          .catch(error => {
            console.error('Error updating user inventory:', error);
          });
      }
      } catch (error) {
        console.error('Error updating user inventory:', error);
      }
    },
  },
  beforeDestroy() {
    // N'oubliez pas de supprimer l'écouteur d'événement lors de la destruction du composant
    window.removeEventListener('victory', this.handleVictory);
  }
};
</script>
