<script>
import SearchBar from "../components/SearchBar.vue"; // Assurez-vous d'ajuster le chemin
import SoloRules from "../components/SoloRules.vue"; // Assurez-vous d'ajuster le chemin
import LifeCounter from '../components/LifeCounter.vue';
import SoloGuesses from '../components/SoloGuesses.vue';
import SoloRevealGuess from '../components/SoloRevealGuess.vue';
import SoloTryAgain from '../components/SoloTryAgain.vue';
import { withScopeId } from "vue";
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore();
export default {
  data() {
    return {
      albums: [], // Le tableau d'albums sera stocké ici
      selectedAlbums: [],
      numberLives: 10 ,
      livesRemaining: 10,
      albumToGuess: null, // Initialize albumToGuess as null
      win : false,
      streamzWin : 10,
      streamzLoss : 1,
      streamzAbandon : 0,
    };
  },

  computed: {
    // Utilisation de la valeur calculée user provenant du script setup
    user() {
      const store = useStore();
      return computed(() => store.state.user).value;
    }
  },

  methods: {
    addToStats(gamePlayed, gameWon, streamz) {
      if (this.user) {
        const updatedUser = {
          "streamz": this.user.inventory.streamz + streamz,
          "items": this.user.inventory.items,
          "username": this.user.inventory.username,
          "profilePicture": this.user.inventory.profile_picture,
          "gamesWon": this.user.inventory.games_won + gameWon,
          "gamesPlayed": this.user.inventory.games_played + gamePlayed,
          "user": this.user
        }; // Créez un objet avec la nouvelle valeur du username

        // Utilisez fetch pour effectuer la mise à jour
        fetch(`http://127.0.0.1:8000/api/inventories/${this.user.inventory.id}`, {
          method: 'PUT', // Utilisez la méthode PUT
          headers: {
            'Content-Type': 'application/ld+json', // Spécifiez le type de contenu JSON
          },
          body: JSON.stringify(updatedUser),
        })
        .then(response => response.json())
        .then(data => {
          this.user.inventory.gameswon = data.gameswon;
          this.user.inventory.gamesplayed = data.gamesplayed;

          // Vérifier si la mise à jour a été effectuée avec succès
          console.log('User inventory updated successfully:', data);
        })
        .catch(error => {
          console.error('Error updating user inventory:', error);
          // Ajouter des actions pour gérer les erreurs ici
        });
      } else {
        console.error('User or user inventory is undefined');
      }     
    },

    async handleAlbumSelected(albumId) {
      try{
        // Recherche de l'album correspondant dans le tableau JSON
        const selectedAlbum = this.albums.find(album => album.id === albumId);
        const checkSelected = this.selectedAlbums.find(album => album.id === selectedAlbum.id);
        if (checkSelected === undefined) {
          this.selectedAlbums.push(selectedAlbum); // Ajouter l'album au tableau de "réponses"

          if (selectedAlbum.id == this.albumToGuess.id) {
            this.win = true; 
            this.addToStats(1, 1, this.streamzWin);  
          }

          return this.checkSelected
        }
      }catch (error) {
        console.error('Error in handleAlbumSelected:', error)
      }
      
    },
    async handleLivesRemaining(albumId){
      try{
        this.livesRemaining = this.livesRemaining - 1

        if (this.livesRemaining == 0) {
          this.selectedAlbums.push(this.albumToGuess);
          this.addToStats(1, 0, this.streamzLoss);
        }
      }catch (error) {
        console.error('Error in handleLivesRemaining:', error)
      }
    },
    handleTryAgain() {
      try{
        this.selectedAlbums = [];
        this.livesRemaining = 10;
        this.albumToGuess = this.albums[Math.floor(Math.random() * this.albums.length)];
        this.win = false;

        if (this.livesRemaining >=1 && this.win == false) {
          this.addToStats(1, 0, this.streamzAbandon);
        }
      }catch (error) {
        console.error('Error in handleTryAgain:', error)
      }
    },
  },
  components: {
    SearchBar,
    SoloGuesses,
    SoloRules,
    SoloRevealGuess,
    SoloTryAgain,
    LifeCounter,
  },
  mounted() {
    fetch('http://127.0.0.1:8002/api/alba')
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
        <SearchBar :albums="albums" @album-selected="handleAlbumSelected" @life-counter="handleLivesRemaining" v-if="livesRemaining >= 1 && !win && albums && albumToGuess"/>
        <LifeCounter :remainingLives="livesRemaining" :totalLives="numberLives" v-if="albums && albumToGuess" />
        <SoloRevealGuess :albumToGuess="albumToGuess" :win="win" v-if="(livesRemaining < 1 && albums && albumToGuess) || (win === true && albums && albumToGuess)"/>
        <SoloGuesses :selectedAlbums="selectedAlbums" :albumToGuess="albumToGuess" v-if="albums && albumToGuess"/>
        <SoloTryAgain @try-again="handleTryAgain"/>
    </div>
</template>
