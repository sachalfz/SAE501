<script setup>
import SearchBar from "../components/SearchBar.vue"; // Assurez-vous d'ajuster le chemin
import SoloRules from "../components/SoloRules.vue"; // Assurez-vous d'ajuster le chemin
import LifeCounter from '../components/LifeCounter.vue';
import SoloGuesses from '../components/SoloGuesses.vue';
import SoloRevealGuess from '../components/SoloRevealGuess.vue';
import SoloTryAgain from '../components/SoloTryAgain.vue';
import { withScopeId } from "vue";
</script>

<script>
export default {
  data() {
    return {
      albums: [], // Le tableau d'albums sera stocké ici
      selectedAlbums: [],
      numberLives: 10 ,
      livesRemaining: 10,
      albumToGuess: null, // Initialize albumToGuess as null
      win : false,
    };
  },

  props: {
    randomUser: Object,
    inventory: Object,
    basePath: String,
  },

  methods: {
    addToStats(gamePlayed, gameWon) {
      const updatedUser = {
        "streamz": this.inventory.streamz,
        "items": this.inventory.items,
        "username": this.inventory.username,
        "profilePicture": this.inventory.profile_picture,
        "gamesWon": this.inventory.games_won + gameWon,
        "gamesPlayed": this.inventory.games_played + gamePlayed,
        "idUser": this.inventory.id_user
      }; // Créez un objet avec la nouvelle valeur du username

      // Utilisez fetch pour effectuer la mise à jour
      fetch(`http://127.0.0.1:8001/api/inventories/${this.inventory.id}`, {
          method: 'PUT', // Utilisez la méthode PUT
          headers: {
              'Content-Type': 'application/ld+json', // Spécifiez le type de contenu JSON
          },
          body: JSON.stringify(updatedUser),
      })
          .then(response => response.json())
          .then(data => {
            this.inventory.games_won = data.games_won;
            this.inventory.games_played = data.games_played;
          })
    },

    handleAlbumSelected(albumId) {
      // Recherche de l'album correspondant dans le tableau JSON
      const selectedAlbum = this.albums.find(album => album.id === albumId);
      const checkSelected = this.selectedAlbums.find(album => album.id === selectedAlbum.id);
      if (checkSelected === undefined) {
        this.selectedAlbums.push(selectedAlbum); // Ajouter l'album au tableau de "réponses"

        if (selectedAlbum.id == this.albumToGuess.id) {
          this.win = true; 
          this.addToStats(1, 1);
        }

        return this.checkSelected
      }
    },
    handleLivesRemaining(albumId){
      this.livesRemaining = this.livesRemaining - 1

      if (this.livesRemaining == 0) {
        this.selectedAlbums.push(this.albumToGuess);
        this.addToStats(1, 0);
      } 
    },
    handleTryAgain() {
      // Réinitialisez les données
      this.selectedAlbums = [];
      this.livesRemaining = 10;
      this.albumToGuess = this.albums[Math.floor(Math.random() * this.albums.length)];
      this.win = false;

      if (this.livesRemaining >=1 && this.win == false) {
        this.addToStats(1, 0);
      }
    },
  },
  components: {
    SearchBar,
    SoloGuesses
  },
  mounted() {
    // Charger le tableau d'albums à partir du fichier JSON
    fetch('../assets/albums.json')
      .then(response => response.json())
      .then(data => {
        this.albums = data;
        this.$nextTick().then(() => {
          this.albumToGuess = this.albums[Math.floor(Math.random() * this.albums.length)]; // Pick a random album
        });
      });
  }
};
</script>

<template>
    <div class="view solo">
        <SoloRules />
        <SearchBar :albums="albums" @album-selected="handleAlbumSelected" @life-counter="handleLivesRemaining" v-if="livesRemaining >= 1 && !win"/>
        <LifeCounter :remainingLives="livesRemaining" :totalLives="numberLives" />
        <SoloRevealGuess :albumToGuess="albumToGuess" :win="win" v-if="(livesRemaining < 1 && albumToGuess) || (win === true && albumToGuess)"/>
        <SoloGuesses :selectedAlbums="selectedAlbums" :albumToGuess="albumToGuess" v-if="albumToGuess"/>
        <SoloTryAgain @try-again="handleTryAgain"/>
    </div>
</template>
