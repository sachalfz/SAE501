<script setup>
import { RouterLink, RouterView } from 'vue-router'
import MainNav from './components/MainNav.vue'
import axios from 'axios';
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
    fetch('http://127.0.0.1:8000/api/users')
    .then(response => response.json())
    .then(data => {
      this.users = data['hydra:member'];
      this.randomUser = this.users[2];
      console.log(this.randomUser)

      // Une fois que randomUser est disponible, effectuer le deuxième fetch
      fetch(`http://127.0.0.1:8001/api/inventories/${this.randomUser.id_inventory}`)
        .then(response => response.json())
        .then(data => {
          this.inventory = data;
          console.log(this.inventory)
        })
        .catch(error => {
          console.error(error);
        }
      );

    })
    .catch(error => {
      console.error(error);
    });
  },
};
</script>

<template>
  <div class="page">
    <MainNav :randomUser="randomUser" :inventory="inventory" :basePath="basePath" v-if="randomUser && inventory"/>
  
    <RouterView :randomUser="randomUser" :inventory="inventory" :basePath="basePath" v-if="randomUser && inventory"/>
  </div>
</template>


