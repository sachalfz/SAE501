<script setup>
import { useRouter } from 'vue-router';
</script>

<template>
    <header class="header">
      <nav class="nav--layout">
        <a class="nav--logo" :href="basePath">
          <img src="../../assets/logo/full_yellow.svg" alt="Logo" height="60">
        </a>
        <ul class="nav--list">

          <li class="nav-item">
            <a class=" nav--cat" :href="basePath">
              <img src="../../assets/nav/solo.svg" alt="Logo" height="40">
              <p class="nav--text">SOLO</p>
            </a>
          </li>
          
          <li class="nav-item">
            <a class=" nav--cat" :href="basePath + '3dgame'">
              <img src="../../assets/nav/3d.svg" alt="Logo" height="40">
              <p class="nav--text">3D GAME</p>
            </a>
          </li>

          <li class="nav-item">
            <a class=" nav--cat" :href="basePath + 'shop'">
              <img src="../../assets/icons/shop_yellow.svg" alt="Logo" height="40">
              <p class="nav--text">SHOP</p>
            </a>
          </li>

          <li class="nav-item">
            <a :href="basePath + 'account/' + randomUser.id" class="nav--cat">
              <img :src="getUserImage()" alt="Profile pic" height="36" class="nav--img">
              <p class="nav--text">ACCOUNT</p>
            </a>
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