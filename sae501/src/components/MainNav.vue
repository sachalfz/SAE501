<template>
<<<<<<< HEAD
  <NavDesktop v-if="windowWidth > 1300" />

  <NavMobile v-else />

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
=======
  <header class="fixed-top">
    <nav class="navbar navbar-light bg-light" style="padding: 32px 128px;">

      <a class="navbar-brand" href="#">
        <img src="../assets/logo/full_yellow.svg" alt="Logo" height="60">
      </a>

      <ul class="navbar-nav d-flex flex-row align-items-center text-uppercase" style="gap:3rem;">

        <li class="nav-item">
          <a class="nav-link d-flex align-items-center justify-content-center" href="#" style="gap: 0.5rem;">
            <img src="../assets/nav/solo.svg" alt="Logo" height="40">
            <p class="my-0 fw-bold">SOLO</p>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link d-flex align-items-center justify-content-center" href="#" style="gap: 0.5rem;">
            <img src="../assets/nav/daily.svg" alt="Logo" height="40">
            <p class="my-0 fw-bold">DAILY</p>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link d-flex align-items-center justify-content-center" href="#" style="gap: 0.5rem;">
            <img src="../assets/nav/multiplayer.svg" alt="Logo" height="40">
            <p class="my-0 fw-bold">MULTIPLAYER</p>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link d-flex align-items-center justify-content-center" href="#" style="gap: 0.5rem;">
            <img src="../assets/nav/3d.svg" alt="Logo" height="40">
            <p class="my-0 fw-bold">3D GAME</p>
          </a>
        </li>

      </ul>

    </nav>
  </header>
</template>

<script>
export default {
  name: 'NavbarComponent',
}
>>>>>>> 0e56db26e0632d8af0392f68df42c317a9e43c62
</script>
