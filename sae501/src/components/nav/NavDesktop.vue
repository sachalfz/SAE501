<script setup>
import { useRouter } from 'vue-router';
</script>

<template>
    <header class="header">
      <nav class="nav--layout">
        <a class="nav--logo" href="/">
          <img src="../../assets/logo/full_yellow.svg" alt="Logo" height="60">
        </a>
        <ul class="nav--list">

          <li class="nav-item">
            <a class=" nav--cat" href="/">
              <img src="../../assets/nav/solo.svg" alt="Logo" height="40">
              <p class="nav--text">SOLO</p>
            </a>
          </li>
          
          <li class="nav-item">
            <a class=" nav--cat" href="/3dgame">
              <img src="../../assets/nav/3d.svg" alt="Logo" height="40">
              <p class="nav--text">3D GAME</p>
            </a>
          </li>

          <li class="nav-item">
            <router-link :to="'/account/' + randomUser.id" class="nav--cat">
              <img :src="getUserImage()" alt="Profile pic" height="40" class="nav--img">
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
  },
  methods: {
    getUserImage() {
      if (this.randomUser.profilepic != null) {
          return this.randomUser.profilepic; // Remplacez par le chemin de votre image pour une vie active
      }
    }
  }
  
}
</script>