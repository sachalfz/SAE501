<script setup>
import SearchBar from "../components/SearchBar.vue"; // Assurez-vous d'ajuster le chemin
import SoloRules from "../components/SoloRules.vue"; // Assurez-vous d'ajuster le chemin
import LifeCounter from '../components/LifeCounter.vue';
import SoloGuesses from '../components/SoloGuesses.vue';
import SoloRevealGuess from '../components/SoloRevealGuess.vue';
import SoloTryAgain from '../components/SoloTryAgain.vue';
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
  methods: {
    handleAlbumSelected(albumId) {
      // Recherche de l'album correspondant dans le tableau JSON
      const selectedAlbum = this.albums.find(album => album.id === albumId);
      const checkSelected = this.selectedAlbums.find(album => album.id === selectedAlbum.id);
      if (checkSelected === undefined) {
        this.selectedAlbums.push(selectedAlbum); // Ajouter l'album au tableau de "réponses"

        if (selectedAlbum.id == this.albumToGuess.id) {
          this.win = true;  
        }
      }
    },
    handleLivesRemaining(albumId){
      this.livesRemaining = this.livesRemaining - 1

      if (this.livesRemaining == 0) {
        this.selectedAlbums.push(this.albumToGuess);
      }
    },
    handleTryAgain() {
      // Réinitialisez les données
      this.selectedAlbums = [];
      this.livesRemaining = 10;
      this.albumToGuess = this.albums[Math.floor(Math.random() * this.albums.length)];
      this.win = false;
    }
  },
  components: {
    SearchBar,
    SoloGuesses
  },
  mounted() {
    // Charger le tableau d'albums à partir du fichier JSON
    fetch('./assets/albums.json')
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
