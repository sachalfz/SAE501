<template>
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
</script>
