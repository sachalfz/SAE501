<template>
    <p class="sologuesses--self--txt" v-if="albumToGuess !== null">{{ albumToGuess.nom }}</p>
    <div class="sologuesses">
        <div class="sologuesses--categories">
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Nom</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Artiste</p> </div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Année</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Genre</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Label</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Certification</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Beatmakers</p></div>
        </div>
        <div class="sologuesses--results">
            <div v-for="(album, index) in selectedAlbums" :key="index" class="sologuesses--album">
                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'nom'), 'false': !isPropertyMatchingString(album, 'nom') }">
                    <p class="sologuesses--self--txt">{{ album.nom }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'artiste'), 'false': !isPropertyMatchingString(album, 'nom') }">
                    <p class="sologuesses--self--txt">{{ album.artiste }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'date'), 'false': !isPropertyMatchingString(album, 'nom') }">
                    <p class="sologuesses--self--txt">{{ album.date }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'genre'), 'false': !isPropertyMatchingString(album, 'nom') }">
                    <p class="sologuesses--self--txt">{{ album.genre }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'label'), 'false': !isPropertyMatchingString(album, 'nom') }">
                    <p class="sologuesses--self--txt">{{ album.label }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'certification'), 'false': !isPropertyMatchingString(album, 'nom') }">
                    <p class="sologuesses--self--txt">{{ album.certification }}</p>
                </div>

                <div class="sologuesses--self" :class="{ 'true': isPropertyMatchingString(album, 'beatmakers'), 'false': !isPropertyMatchingString(album, 'nom') }">
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
      // Compare le contenu de la propriété spécifiée entre selectedAlbum et albumToGuess en tant que chaîne de caractères
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
  },
};
</script>