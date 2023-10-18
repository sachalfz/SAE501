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
      selectedAlbums: []
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
      });
  }
};
</script>

<template>
    <div class="view solo">
        <SoloRules />
        <SearchBar :albums="albums" @album-selected="handleAlbumSelected"/>
        <LifeCounter :remainingLives="7" :totalLives="10" />
        <SoloGuesses :selectedAlbums="selectedAlbums"/>
    </div>
</template>
