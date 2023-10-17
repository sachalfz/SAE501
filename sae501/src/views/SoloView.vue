<script setup>
import SearchBar from "../components/SearchBar.vue"; // Assurez-vous d'ajuster le chemin
import SoloRules from "../components/SoloRules.vue"; // Assurez-vous d'ajuster le chemin
import LifeCounter from '../components/LifeCounter.vue';
import SoloGuesses from '../components/SoloGuesses.vue';
</script>

<script>
</script>

<template>
    <div class="view solo">
        <SoloRules />
        <SearchBar />
        <LifeCounter :remainingLives="7" :totalLives="10" />
        <SoloGuesses />
    </div>
</template>
