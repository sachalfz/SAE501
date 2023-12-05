<template>
  <header class="header">
      <nav class="nav--layout-mobile">
          <router-link :to="'/'" class="nav--logo">
              <img src="../assets/logo/full_yellow.svg" alt="Logo" height="60">
          </router-link>

          <button @click="toggleMenu" class="nav--popup">
              <img src="../assets/icons/nav_yellow.svg" alt="open">
          </button>
      </nav>
  </header>

  <div class="popup--menu" v-show="isMenuOpen">
      <button class="popup--close-button" @click="toggleMenu">
          <img src="../assets/icons/close_yellow.svg" alt="close">
      </button>

      <router-link :to="'/'" class="nav--cat" style="gap: 0.5rem;">
          <img src="../assets/nav/solo.svg" alt="Logo" class="nav--cat-logo">
          <p class="nav--text">SOLO</p>
      </router-link>

      <router-link :to="'/3dgame'" class="nav--cat" style="gap: 0.5rem;">
          <img src="../assets/nav/3d.svg" alt="Logo" class="nav--cat-logo">
          <p class="nav--text">3D</p>
      </router-link>

      <router-link :to="'/shop'" class=" nav--cat">
          <img src="../assets/icons/shop_yellow.svg" alt="Logo" class="nav--cat-logo">
          <p class="nav--text">SHOP</p>
      </router-link>

      <router-link v-if="user && user.isAuthenticated" :to="`/account/${user.id}`" class="nav--cat">
        <img :src="this.user.inventory.profilepicture" alt="Profile pic" height="36" class="nav--img">
        <p class="nav--text">ACCOUNT</p>
      </router-link>

      <router-link v-else to="/login" class="nav--cat">
        <p class="nav--text">LOGIN</p>
      </router-link>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  computed: {
    // Utilisation de la valeur calculée user provenant du script setup
    user() {
      const store = useStore();
      return computed(() => store.state.user).value;
    },
    inventory() {
      const store = useStore();
      return computed(() => store.state.inventory).value;
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>
