<template>
  <div v-if="randomUser">
    <NavDesktop v-if="windowWidth > 1300 && randomUser" :randomUser="randomUser"/>

    <NavMobile v-else :randomUser="randomUser" />
  </div>

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
  props: {
    randomUser: Object,
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
