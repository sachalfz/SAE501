<script setup>
import { RouterLink, RouterView } from 'vue-router'
import MainNav from './components/MainNav.vue'
</script>

<script>
export default {
  data() {
    return {
        users:[],
        randomUser: null,
    };
  },
  
  mounted() {
  // Charger le tableau d'utilisateurs à partir du fichier JSON
  fetch('./assets/users.json')
    .then(response => response.json())
    .then(data => {
      this.users = data;
      this.$nextTick().then(() => {
        this.randomUser = this.users[Math.floor(Math.random() * this.users.length)]; // Pick a random utilisateur
      });
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors du chargement du fichier JSON :', error);
    });
}

};
</script>

<template>
  <div class="page">
    <MainNav :randomUser="randomUser" v-if="randomUser"/>
  
    <RouterView :randomUser="randomUser" v-if="randomUser"/>
  </div>
</template>


