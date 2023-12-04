<script setup>
import { RouterLink, RouterView } from 'vue-router'
import MainNav from './components/MainNav.vue'
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
</script>

<script>
export default {
  data() {
    return {
      randomUser: null,
      users: [],
      albums: [],
      inventory: null,
      basePath: this.$router.options.base
    };
  },
  mounted() {
    
  },
};
</script>

<template>
  <div class="page">
    <MainNav :randomUser="randomUser" :inventory="inventory" :basePath="basePath"/>
  
    <RouterView :randomUser="randomUser" :inventory="inventory" :basePath="basePath"/>
  </div>
</template>


