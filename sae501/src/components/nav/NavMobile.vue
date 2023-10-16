<template>
    <header class="header">
        <nav class="nav--layout-mobile">
            <a class="nav--logo" href="#">
                <img src="../../assets/logo/full_yellow.svg" alt="Logo" height="60">
            </a>

            <button @click="toggleMenu" class="nav--popup">
                <img src="../../assets/icons/nav_yellow.svg" alt="open">
            </button>
        </nav>
    </header>

    <div class="popup--menu" v-show="isMenuOpen">
        <button class="popup--close-button" @click="toggleMenu">
            <img src="../../assets/icons/close_yellow.svg" alt="close">
        </button>

        <a class="nav--cat" href="/solo" style="gap: 0.5rem;">
            <img src="../../assets/nav/solo.svg" alt="Logo" class="nav--cat-logo">
            <p class="nav--text">SOLO</p>
        </a>
        <!-- <a class="nav--cat" href="/daily" style="gap: 0.5rem;">
            <img src="../assets/nav/daily.svg" alt="Logo" class="nav--cat-logo">
            <p class="nav--text">DAILY</p>
        </a>
        <a class="nav--cat" href="/multiplayer" style="gap: 0.5rem;">
            <img src="../assets/nav/multiplayer.svg" alt="Logo" class="nav--cat-logo">
            <p class="nav--text">MULTIPLAYER</p>
        </a> -->
        <a class="nav--cat" href="/3dgame" style="gap: 0.5rem;">
            <img src="../../assets/nav/3d.svg" alt="Logo" class="nav--cat-logo">
            <p class="nav--text">3D</p>
        </a>
    </div>
    
</template>

<script>
    export default {
        data() {
            return {
            isMenuOpen: false,
            };
        },
        methods: {
            toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            }
        },
    };
</script>