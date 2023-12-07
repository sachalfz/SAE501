<script setup>
import { RouterLink, RouterView } from 'vue-router'
import MainNav from './components/MainNav.vue'
import { useStore } from 'vuex';

const store = useStore();
</script>

<template>
  <div class="page">
    <MainNav/>
  
    <RouterView/>
  </div>
</template>


