<template>
    <div class="sologuesses">
        <div class="sologuesses--categories">
            <div class="sologuesses--categories--self"><p class="sologuesses--self--txt">Nom de l'album</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Artiste</p> </div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Année</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Genre</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Label</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Certification</p></div>
            <div class="sologuesses--categories--self"><p class="sologuesses--categories--self--txt">Beatmakers</p></div>
        </div>
        <div class="sologuesses--results">
            <div v-for="(album, index) in selectedAlbums" :key="index" class="sologuesses--album">
                <div class="sologuesses--self"><p class="sologuesses--self--txt">{{ album.nom }}</p></div>
                <div class="sologuesses--self"><p class="sologuesses--self--txt">{{ album.artiste }}</p></div>
                <div class="sologuesses--self"><p class="sologuesses--self--txt">{{ album.date }}</p></div>
                <div class="sologuesses--self"><p class="sologuesses--self--txt">{{ album.genre }}</p></div>
                <div class="sologuesses--self"><p class="sologuesses--self--txt">{{ album.label }}</p></div>
                <div class="sologuesses--self"><p class="sologuesses--self--txt">{{ album.certification }}</p></div>
                <div class="sologuesses--self" v-for="(beatmakers, index) in album.beatmakers" :key="index">
                    <p class="sologuesses--self--txt">{{ beatmakers }}</p>
                </div>
            </div>
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