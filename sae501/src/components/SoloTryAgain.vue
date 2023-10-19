<template>
    <button @click="tryAgain" class="tryagain">Try Again</button> <!-- Ajoutez le bouton Try Again -->
</template>

<script>
export default {
    methods: {
      tryAgain() {
        this.$emit('try-again', true);
      },
    }
  };
</script>