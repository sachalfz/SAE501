<script setup>
import { RouterLink, useRouter } from 'vue-router';
</script>

<template>
    <header class="header">
      <nav class="nav--layout">
        <router-link :to="'/'" class="nav--logo">
          <img src="../../assets/logo/full_yellow.svg" alt="Logo" height="60">
        </router-link>
        <ul class="nav--list">

          <li class="nav-item">
            <router-link :to="'/'" class=" nav--cat">
              <img src="../../assets/nav/solo.svg" alt="Logo" height="40">
              <p class="nav--text">SOLO</p>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link :to="'/3dgame'" class=" nav--cat">
              <img src="../../assets/nav/3d.svg" alt="Logo" height="40">
              <p class="nav--text">3D GAME</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="'/shop'" class=" nav--cat" :href="basePath + 'shop'">
              <img src="../../assets/icons/shop_yellow.svg" alt="Logo" height="40">
              <p class="nav--text">SHOP</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="`/account/${randomUser.id}`" class="nav--cat">
              <img :src="getUserImage()" alt="Profile pic" height="36" class="nav--img">
              <p class="nav--text">ACCOUNT</p>
            </router-link>
          </li>

        </ul>
      </nav>
    </header>
</template>

<script>
export default {
  props: {
    randomUser: Object,
    inventory: Object,
    basePath: String,
  },
  methods: {
    getUserImage() {
      if (this.inventory.profile_picture != null) {
          return this.inventory.profile_picture; // Remplacez par le chemin de votre image pour une vie active
      }
    }
  }
  
}
</script>