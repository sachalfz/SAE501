<script setup>
import { useRouter } from 'vue-router';
</script>

<template>
    <header class="header">
        <nav class="nav--layout-mobile">
            <a class="nav--logo" href="/">
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

        <a class="nav--cat" href="/" style="gap: 0.5rem;">
            <img src="../../assets/nav/solo.svg" alt="Logo" class="nav--cat-logo">
            <p class="nav--text">SOLO</p>
        </a>

        <a class="nav--cat" href="/3dgame" style="gap: 0.5rem;">
            <img src="../../assets/nav/3d.svg" alt="Logo" class="nav--cat-logo">
            <p class="nav--text">3D</p>
        </a>

        <a class=" nav--cat" href="/shop">
            <img src="../../assets/icons/shop_yellow.svg" alt="Logo" class="nav--cat-logo">
            <p class="nav--text">SHOP</p>
        </a>

        <router-link :to="'/account/' + randomUser.id" class="nav--cat">
            <img :src="getUserImage()" alt="Profile pic" height="36" class="nav--img">
            <p class="nav--text">ACCOUNT</p>
        </router-link>
    </div>
    
</template>

<script>
    export default {
        data() {
            return {
            isMenuOpen: false,
            };
        },
        props: {
            randomUser: Object,
        },
        methods: {
            toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            },
            getUserImage() {
                if (this.randomUser.profilepic != null) {
                    return this.randomUser.profilepic; // Remplacez par le chemin de votre image pour une vie active
                }
            }
        },
    };
</script>