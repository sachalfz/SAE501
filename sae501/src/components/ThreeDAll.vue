<script setup>
    import CanvaThreeD from "../components/CanvaThreeD.vue";
</script>

<template>
    <div class="threed--content">
        <div class="threed--command">
            <p class="threed--command--txt">Use</p>
            <img src="../assets/icons/key_z_yellow.svg" alt="z" class="threed--command--icon">
            <img src="../assets/icons/key_q_yellow.svg" alt="q" class="threed--command--icon">
            <img src="../assets/icons/key_s_yellow.svg" alt="s" class="threed--command--icon">
            <img src="../assets/icons/key_d_yellow.svg" alt="d" class="threed--command--icon">
            <p class="threed--command--txt">to move around and</p>
            <img src="../assets/icons/key_space_yellow.svg" alt="space" class="threed--command--icon">
            <p class="threed--command--txt">to jump.</p>
        </div>
        <p class="threed--rules">Get on the <span class="threed--highlight">album cover</span> corresponding to the <span class="threed--highlight">song playing</span> without falling between the <span class="threed--highlight">tiles</span> !</p>
        <CanvaThreeD />
    </div>    
</template>