<template>
  <NavDesktop v-if="windowWidth > 1300" />

  <NavMobile v-else />

</template>

<script setup>
import NavDesktop from './nav/NavDesktop.vue'
import NavMobile from './nav/NavMobile.vue'
</script>

<script>
export default {
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
  },
};
</script>
