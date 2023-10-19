<script setup>
import SearchBar from "../components/SearchBar.vue"; // Assurez-vous d'ajuster le chemin
import SoloRules from "../components/SoloRules.vue"; // Assurez-vous d'ajuster le chemin
import LifeCounter from '../components/LifeCounter.vue';
import SoloGuesses from '../components/SoloGuesses.vue';
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
    };
  },
  methods: {
    handleAlbumSelected(albumName) {
      if (typeof albumName === 'string') {
        // Recherche de l'album correspondant dans le tableau JSON
        const selectedAlbum = this.albums.find(album => album.nom.toLowerCase() === albumName.toLowerCase());
        
        if (selectedAlbum) {
          this.selectedAlbums.push(selectedAlbum); // Ajouter l'album au tableau de "réponses"
        }
      }
    },
    handleLivesRemaining(){
      this.livesRemaining = this.livesRemaining - 1
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
        this.albumToGuess = this.albums[Math.floor(Math.random() * this.albums.length)]; // Pick a random album
      });
  }
};
</script>

<template>
    <div class="view solo">
        <SoloRules />
        <SearchBar :albums="albums" @album-selected="handleAlbumSelected" @life-counter="handleLivesRemaining"/>
        <LifeCounter :remainingLives="livesRemaining" :totalLives="numberLives" />
        <SoloGuesses :selectedAlbums="selectedAlbums" :albumToGuess="albumToGuess"/>
    </div>
</template>
