<template>
    <div>
      <h1>Recherche d'Albums</h1>
      <div class="row">
        <div class="col-md-4">
          <input type="text" v-model="searchQuery" @input="updateAutocomplete" placeholder="Rechercher un album">
          <ul id="autocomplete-results" v-show="showAutocomplete">
            <li v-for="(album, index) in autocompleteAlbums" @click="selectAutocompleteResult(album)" :key="album.nom">
              {{ album.nom }}
            </li>
          </ul>
        </div>
        <div class="col-md-8">
          <div id="selected-album" v-if="selectedAlbum" class="result-box">
            <h2>Résultat sélectionné</h2>
            <div :class="{ 'green-box': isMatch(selectedAlbum), 'red-box': !isMatch(selectedAlbum) }">
              <p><strong>Nom de l'album :</strong> {{ selectedAlbum.nom }}</p>
              <p><strong>Année :</strong> {{ selectedAlbum.année }}</p>
              <p><strong>Style :</strong> {{ selectedAlbum.style }}</p>
              <p><strong>Label :</strong> {{ selectedAlbum.label }}</p>
            </div>
            <button @click="clearResults">Effacer les résultats</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
        albums: [
          {
            nom: "Thriller",
            année: 1982,
            style: "Pop",
            label: "Epic Records"
          },
          {
            nom: "The Dark Side of the Moon",
            année: 1973,
            style: "Rock progressif",
            label: "Harvest Records"
          },
          {
            nom: "Back in Black",
            année: 1980,
            style: "Hard Rock",
            label: "Albert Productions"
          },
          {
            nom: "Abbey Road",
            année: 1969,
            style: "Rock",
            label: "Apple Records"
          },
          {
            nom: "Hotel California",
            année: 1976,
            style: "Rock",
            label: "Asylum Records"
          },
          // Ajoutez d'autres albums ici
        ],
        selectedAlbum: null,
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
      selectAutocompleteResult(album) {
        this.searchQuery = album.nom;
        this.showAutocomplete = false;
        this.selectAlbum(album);
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
      isMatch(album) {
        return album === this.selectedAlbum;
      }
    }
  };
  </script>
  
  <!-- Style Bootstrap -->
  <style>
    .result-box {
      margin-top: 10px;
    }
  
    .green-box {
      background-color: #c3e6cb; /* Vert */
      padding: 10px;
    }
  
    .red-box {
      background-color: #f5c6cb; /* Rouge */
      padding: 10px;
    }
  
    #autocomplete-results {
      position: absolute;
      background-color: white;
      border: 1px solid #ccc;
      max-height: 100px;
      overflow-y: auto;
      z-index: 1;
    }
  </style>
  