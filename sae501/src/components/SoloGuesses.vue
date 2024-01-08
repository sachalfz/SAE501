<template>
    <!-- <p class="sologuesses--self--txt">{{ this.albumToGuess.name }}</p> -->
    <div class="sologuesses">
        <div class="sologuesses--categories">
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Name</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Artist</p> </div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Year</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Label</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Certification</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Beatmakers</p></div>
        </div>
        <div class="sologuesses--results">
            <div v-for="(album, index) in selectedAlbums" :key="index" class="sologuesses--album">
                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'name'), 'false': !isPropertyMatchingString(album, 'name') }">
                    <p class="sologuesses--self--txt">{{ album.name }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'artist'), 'false': !isPropertyMatchingString(album, 'artist') }">
                    <p class="sologuesses--self--txt">{{ album.artist }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'date'), 'false': !isPropertyMatchingString(album, 'date') }">
                    <p class="sologuesses--self--txt">{{ album.date }}</p>
                    <img v-if="!isPropertyMatchingString(album, 'date')" :src="getArrowState(album, 'date')" alt="Life" class="sologuesses--arrow--icon">
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'label'), 'false': !isPropertyMatchingString(album, 'label') }">
                    <p class="sologuesses--self--txt">{{ album.label }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'certification'), 'false': !isPropertyMatchingString(album, 'certification') }">
                    <template v-if="album.certification">
                      <p class="sologuesses--self--txt">{{ album.certification}}</p>
                    </template>
                    <template v-else>
                      <p class="sologuesses--self--list--txt">No data</p>
                    </template>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'beatmakers'), 'false': !isPropertyMatchingString(album, 'beatmakers') }">
                    <template v-if="album.beatmakers && album.beatmakers.length">
                        <p class="sologuesses--self--list--txt" v-for="(beatmaker, index) in album.beatmakers" :key="index">{{ beatmaker }}</p>
                    </template>
                    <template v-else>
                        <p class="sologuesses--self--list--txt">No data</p>
                    </template>
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
          return "https://mmi21-05.mmi-limoges.fr/assets/icons/arrow_up_dark.svg"; // Remplacez par le chemin de votre image pour une vie active
      } 
      else {
          return "https://mmi21-05.mmi-limoges.fr/assets/icons/arrow_down_dark.svg"; // Remplacez par le chemin de votre image pour une vie inactive
      }
    }
  },
};
</script>