<template>
  <div class="revealguess">
    <p class="revealguess--title">The result was:</p>
    <p class="revealguess--txt">{{ this.albumToGuess.name }}</p>
    <img :src="albumToGuess.cover" class="revealguess--cover" alt="album cover" />
    <p class="revealguess--header" :class="{ 'win': win, 'loose': !win }">{{ win ? 'YOU WIN' : 'YOU LOOSE' }}</p>
  </div>
</template>

<script>
export default {
  props: {
    albumToGuess: Object,
    win: Boolean,
  },
};
</script>