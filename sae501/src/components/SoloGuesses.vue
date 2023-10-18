<template>
    <div class="sologuesses">
        <!-- <p class="sologuesses--txt">Results will be shown here</p> -->
        <div v-for="(album, index) in selectedAlbums" :key="index" class="sologuesses--album">
            <div class="sologuesses--self"><p class="sologuesses--self--txt">Nom de l'album : {{ album.nom }}</p></div>
            <div class="sologuesses--self"><p class="sologuesses--self--txt">Année : {{ album.date }}</p></div>
            <div class="sologuesses--self"><p class="sologuesses--self--txt">Genre : {{ album.genre }}</p></div>
            <div class="sologuesses--self"><p class="sologuesses--self--txt">Label : {{ album.label }}</p></div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    selectedAlbums: Array // Le tableau de "réponses"
  }
};
</script>