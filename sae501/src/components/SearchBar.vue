<template>
  <div class="group--searchbar">
    <div class="searchbar">
      <input type="text" v-model="searchQuery" @input="updateAutocomplete" placeholder="Rechercher un album" class="searchbar--txt">
      <img src="../assets/icons/search_dark.svg" alt="search" class="searchbar--icon"/>
    </div>
    <div v-show="showAutocomplete" class="searchbar--autocompletion">
      <div class="searchbar--autocompletion--self" v-for="(album, index) in autocompleteAlbums" @click="selectAutocompleteResult(album.nom, album.id)" :key="album.nom && album.id">
        <p class="searchbar--autocompletion--self--txt">{{ album.nom }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
      albums: Array,
    },
    data() {
      return {
        searchQuery: '',
        autocompleteAlbums: [],
        showAutocomplete: false
      };
    },
    computed: {
      filteredAlbums() {
        return this.albums.filter(album => album.nom.toLowerCase().includes(this.searchQuery.toLowerCase()));
      }
    },
    methods: {
      updateAutocomplete() {
        this.showAutocomplete = this.searchQuery.length > 0;
        this.autocompleteAlbums = this.filteredAlbums.slice(0, 5);
      },
      selectAutocompleteResult(albumName, albumId) {
        this.searchQuery = albumName;
        this.showAutocomplete = false;
        this.$emit('album-selected', albumId); // Émettre le nom de l'album
        this.$emit('life-counter', albumId);
      },
      selectAlbum(album) {
        if (this.isMatch(album)) {
          this.selectedAlbum = album;
        }
      },
      clearResults() {
        this.selectedAlbum = null;
        this.searchQuery = '';
        this.autocompleteAlbums = [];
      },
    }
  };
</script>
  