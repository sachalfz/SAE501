<script setup>
import { RouterLink, RouterView } from 'vue-router'
import MainNav from './components/MainNav.vue'
import { useStore } from 'vuex';

const store = useStore();
</script>

<script>
export default {
  mounted() {
    // Add a global event listener for the spacebar key
    window.addEventListener('keydown', this.handleSpacebar);
  },
  methods: {
    handleSpacebar(event) {
      // Check if the pressed key is the spacebar
      if (event.key === ' ') {
        // Prevent the default behavior of the spacebar (preventing page scroll)
        event.preventDefault();

        // Optionally, you can add your custom spacebar handling logic here
      }
    },
  },
};
</script>

<template>
  <div class="page" >
    <MainNav/>
  
    <RouterView/>
  </div>
</template>


