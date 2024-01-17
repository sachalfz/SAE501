<template>
  <div class="view solo">
    <SoloRules />
    <SearchBar :albums="albums" @album-selected="handleAlbumSelected" @life-counter="handleLivesRemaining" v-if="livesRemaining >= 1 && !win && albums && albumToGuess"/>
    <LifeCounter :remainingLives="livesRemaining" :totalLives="numberLives" v-if="albums && albumToGuess" />
    <SoloRevealGuess :albumToGuess="albumToGuess" :win="win" v-if="(livesRemaining < 1 && albums && albumToGuess) || (win === true && albums && albumToGuess)"/>
    <SoloTryAgain @try-again="handleTryAgain"/>
    <SoloGuesses :selectedAlbums="selectedAlbums" :albumToGuess="albumToGuess" v-if="albums && albumToGuess"/>
  </div>
</template>

<script>
import SearchBar from "../components/SearchBar.vue";
import SoloRules from "../components/SoloRules.vue";
import LifeCounter from '../components/LifeCounter.vue';
import SoloGuesses from '../components/SoloGuesses.vue';
import SoloRevealGuess from '../components/SoloRevealGuess.vue';
import SoloTryAgain from '../components/SoloTryAgain.vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { apiShop } from '@/main.js';
import { apiMusic } from '@/main.js';
import { apiUserInventory } from '@/main.js';

export default {
  components: {
    SearchBar,
    SoloRules,
    LifeCounter,
    SoloGuesses,
    SoloRevealGuess,
    SoloTryAgain
  },
  data() {
    return {
      albums: [],
      selectedAlbums: [],
      numberLives: 10,
      livesRemaining: 10,
      albumToGuess: null,
      win: false,
      streamzWin: 500,
      streamzLoss: 50,
      streamzAbandon: 0,
      currentUser: null
    };
  },
  computed: {
    // Utilisation de la valeur calculée user provenant du script setup
    user() {
      const store = useStore();
      return computed(() => store.state.user).value;
    },
  },
  methods: {
    async addToStats(gamePlayed, gameWon, streamz) {
      try {
      if (this.currentUser) {
        const updatedUser = {
          "streamz": this.currentUser.inventory.streamz + streamz,
          "items": this.currentUser.inventory.items,
          "username": this.currentUser.inventory.username,
          "profilepicture": this.currentUser.inventory.profilepicture,
          "gameswon": this.currentUser.inventory.gameswon + gameWon,
          "gamesplayed": this.currentUser.inventory.gamesplayed + gamePlayed,
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
    async handleAlbumSelected(albumId) {
      try {
        const selectedAlbum = this.albums.find(album => album.id === albumId);
        const checkSelected = this.selectedAlbums.find(album => album.id === selectedAlbum.id);
        if (checkSelected === undefined) {
          this.selectedAlbums.push(selectedAlbum);
          if (selectedAlbum.id == this.albumToGuess.id) {
            this.win = true;
            this.addToStats(1, 1, this.streamzWin);
          }
          return this.checkSelected
        }
      } catch (error) {
        console.error('Error in handleAlbumSelected:', error)
      }
    },
    async handleLivesRemaining(albumId) {
      try {
        this.livesRemaining = this.livesRemaining - 1
        if (this.livesRemaining == 0) {
          this.selectedAlbums.push(this.albumToGuess);
          this.addToStats(1, 0, this.streamzLoss);
        }
      } catch (error) {
        console.error('Error in handleLivesRemaining:', error)
      }
    },
    handleTryAgain() {
      try {
        this.selectedAlbums = [];
        this.livesRemaining = 10;
        this.albumToGuess = this.albums[Math.floor(Math.random() * this.albums.length)];
        this.win = false;
        if (this.livesRemaining >= 1 && this.win == false) {
          this.addToStats(1, 0, this.streamzAbandon);
        }
      } catch (error) {
        console.error('Error in handleTryAgain:', error)
      }
    },
  },
  mounted() {
    fetch(`${apiMusic}/api/alba`)
      .then(response => response.json())
      .then(data => {
        this.albums = data;
        this.albumToGuess = this.albums[Math.floor(Math.random() * this.albums.length)];
      });

      this.currentUser = this.user;
  }
};
</script>
