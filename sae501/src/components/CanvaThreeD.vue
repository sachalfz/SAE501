<template>
    <div class="threedcanvas" id="webgl"></div>

    <div v-if="popupDefeatVisible" class="popup3d">
        <div class="popup3d--header">
            <p class="popup3d--header--title lost">YOU LOST</p>
        </div>
        <p class="popup3d--description">Start a New Game or go buy you a nice profile picture to dry out your tears!</p>
        <div class="popup3d--buttons">
          <a href="/3dgame" class="popup3d--buttons--btn">New Game</a>
          <router-link to="/shop" class="popup3d--buttons--btn">Item Shop</router-link>
        </div>
    </div>

    <div v-if="popupVictoryVisible" class="popup3d">
        <div class="popup3d--header">
            <p class="popup3d--header--title win">YOU WON!</p>
        </div>
        <p class="popup3d--description">Start a New Game or go buy a nice profile picture rich man! </p>
        <div class="popup3d--buttons">
          <a href="/3dgame" class="popup3d--buttons--btn">New Game</a>
          <router-link to="/shop" class="popup3d--buttons--btn">Item Shop</router-link>
        </div>
    </div>
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
      currentUser: null,
      popupDefeatVisible: false,
      popupVictoryVisible: false,
    };
  },
  mounted() {
    this.createThree();
    window.addEventListener('victory', this.handleVictory);
    window.addEventListener('defeat', this.handleDefeat);
    window.addEventListener('roundWon', this.handleRoundWon);

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
        this.popupVictoryVisible = true;
      }
    },
    handleDefeat(event) {
      const defeat = event.detail.defeat;
      if (defeat) {
        console.log('You lost!');
        this.popupDefeatVisible = true;
      }
    },
    handleRoundWon(event) {
      const roundWon = event.detail.roundWon;
      if (roundWon) {
        console.log('You won the round!');
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
    window.removeEventListener('defeat', this.handleDefeat);
    window.removeEventListener('roundWon', this.handleRoundWon);
  }
};
</script>
