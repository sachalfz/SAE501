<template>
  <header class="header">
      <nav class="nav--layout-mobile">
          <router-link :to="'/'" class="nav--logo">
              <img src="../assets/logo/full_yellow.svg" alt="Logo" height="60">
          </router-link>

          <button @click="toggleMenu" class="nav--popup">
              <img src="../assets/icons/nav_yellow.svg" alt="Menu" class="nav--popup">
          </button>
      </nav>
  </header>

  <div class="popup--menu">
      <button class="popup--close-button" @click="closeMenu">
          <font-awesome-icon icon="times" class="nav--cat-close"/>
      </button>

      <router-link :to="'/'" class="nav--cat" style="gap: 0.5rem;" @click="closeMenu">
          <img src="../assets/nav/solo.svg" alt="Logo" class="nav--cat-logo">
          <p class="nav--text">SOLO</p>
      </router-link>

      <router-link :to="'/3dgame'" class="nav--cat" style="gap: 0.5rem;" @click="closeMenu">
          <img src="../assets/nav/3d.svg" alt="Logo" class="nav--cat-logo">
          <p class="nav--text">3D</p>
      </router-link>

      <router-link :to="'/shop'" class=" nav--cat" @click="closeMenu">
          <img src="../assets/icons/shop_yellow.svg" alt="Logo" class="nav--cat-logo">
          <p class="nav--text">SHOP</p>
      </router-link>

      <div @click="toggleDropdownAdmin" v-if="(user && user.isAuthenticated) && (user.roles.includes('ROLE_ADMIN') || (user.roles.includes('ROLE_USER') && user.roles.includes('ROLE_ADMIN')))" class="nav--cat nav--cat--admin">
        <img src="https://mmi21-05.mmi-limoges.fr/assets/icons/admin.svg" alt="Logo" class="nav--cat-logo">  
        <p class="nav--text">ADMIN</p>
      </div>

      <router-link v-show="isDropdownVisible" v-if="(user && user.isAuthenticated) && (user.roles.includes('ROLE_ADMIN') || (user.roles.includes('ROLE_USER') && user.roles.includes('ROLE_ADMIN')))" to="/admin/addmusic" class="nav--cat nav--cat--subadmin" @click="closeMenu">
        <p class="nav--text">+ ADD ALBUM</p>
      </router-link>

      <router-link v-show="isDropdownVisible" v-if="(user && user.isAuthenticated) && (user.roles.includes('ROLE_ADMIN') || (user.roles.includes('ROLE_USER') && user.roles.includes('ROLE_ADMIN')))" to="/admin/additem" class="nav--cat nav--cat--subadmin" @click="closeMenu">
        <p class="nav--text">+ ADD SHOP ITEM</p>
      </router-link>

      <router-link v-if="user && user.isAuthenticated" :to="`/account/${user.id}`" class="nav--cat" @click="closeMenu">
        <img :src="user.inventory.profilepicture" alt="Profile pic" height="36" class="nav--img">
        <p class="nav--text">ACCOUNT</p>
      </router-link>
      
      <router-link v-else-if="!(user && user.isAuthenticated)" to="/login" class="nav--cat" @click="closeMenu">
        <p class="nav--text">LOGIN</p>
      </router-link>

      <router-link v-if="user && user.isAuthenticated" to="/logout" class="nav--cat" @click="closeMenu">
        <p class="nav--text">LOGOUT</p>
      </router-link>

      <router-link v-if="!(user && user.isAuthenticated)" to="/register" class="nav--cat test" @click="closeMenu">
        <p class="nav--text">REGISTER</p>
      </router-link>


  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faQuestionCircle, faTimes);

export default {
  data() {
    return {
      isMenuOpen: false,
      isDropdownVisible: false,
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
      const popupMenu = document.querySelector('.popup--menu');
      popupMenu.style.right = '0';
    },
    closeMenu() {
      const popupMenu = document.querySelector('.popup--menu');
      popupMenu.style.right = '-100%';
    },
    toggleDropdownAdmin() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
  },
  components: {
      FontAwesomeIcon
  }
};
</script>
