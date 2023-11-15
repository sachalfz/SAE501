<template>
    <p class="sologuesses--self--txt">{{ this.albumToGuess.name }}</p>
    <div class="sologuesses">
        <div class="sologuesses--categories">
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Name</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Artist</p> </div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Year</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Type</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Label</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Certification</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Beatmakers</p></div>
        </div>
        <div class="sologuesses--results">
            <div v-for="(album, index) in selectedAlbums" :key="index" class="sologuesses--album">
                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'nom'), 'false': !isPropertyMatchingString(album, 'nom') }">
                    <p class="sologuesses--self--txt">{{ album.nom }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'artiste'), 'false': !isPropertyMatchingString(album, 'artiste') }">
                    <p class="sologuesses--self--txt">{{ album.artiste }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'date'), 'false': !isPropertyMatchingString(album, 'date') }">
                    <p class="sologuesses--self--txt">{{ album.date }}</p>
                    <img v-if="!isPropertyMatchingString(album, 'date')" :src="getArrowState(album, 'date')" alt="Life" class="sologuesses--arrow--icon">
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'genre'), 'false': !isPropertyMatchingString(album, 'genre') }">
                    <p class="sologuesses--self--txt">{{ album.genre }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'label'), 'false': !isPropertyMatchingString(album, 'label') }">
                    <p class="sologuesses--self--txt">{{ album.label }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'certification'), 'false': !isPropertyMatchingString(album, 'certification') }">
                    <p class="sologuesses--self--txt">{{ album.certification }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'beatmakers'), 'false': !isPropertyMatchingString(album, 'beatmakers') }">
                    <p class="sologuesses--self--list--txt" v-for="(beatmakers, index) in album.beatmakers" :key="index">{{ beatmakers }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    selectedAlbums: Array, // Le tableau de "réponses"
    albumToGuess: Object,
  },
  methods: {
    isPropertyMatchingString(album, property) {
      const contentSelectedAlbum = album[property];
      const contentAlbumToGuess = this.albumToGuess[property];
      if (contentAlbumToGuess == contentSelectedAlbum) {
        return true
      }
      else {
        return false
      }
    },
    isPropertyMatchingNumber(album, property) {
      // Compare le contenu de la propriété spécifiée entre selectedAlbum et albumToGuess en tant que nombre
      const contentSelectedAlbum = album.property;
      const contentAlbumToGuess = this.albumToGuess.property;

      return Number(contentSelectedAlbum) === Number(contentAlbumToGuess);
    },
    getArrowState(album, property) {
      const contentSelectedAlbum = album[property];
      const contentAlbumToGuess = this.albumToGuess[property];
      console.log(contentSelectedAlbum, contentAlbumToGuess)
      if (contentSelectedAlbum < contentAlbumToGuess) {
          return "../src/assets/icons/arrow_up_dark.svg"; // Remplacez par le chemin de votre image pour une vie active
      } 
      else {
          return "../src/assets/icons/arrow_down_dark.svg"; // Remplacez par le chemin de votre image pour une vie inactive
      }
    }
  },
};
</script>