<template>
    <div class="life">
        <div v-for="(life, index) in lives" :key="index">
            <img :src="getLifeImage(index)" alt="Life" class="life--icon">
        </div>
    </div>
</template>

<script>
import { assetsRepo } from '@/main.js';
export default {
props: {
    remainingLives: {
    type: Number,
    default: 10
    },
    totalLives: {
    type: Number,
    default: 10
    }
},
data() {
    return {
    lives: new Array(this.totalLives)
    };
},
methods: {
    getLifeImage(index) {
    if (index < this.remainingLives) {
        return `${this.assetsRepo}/assets/icons/disk_full.svg`; // Remplacez par le chemin de votre image pour une vie active
    } else {
        return `${this.assetsRepo}/assets/icons/disk_broken.svg`; // Remplacez par le chemin de votre image pour une vie inactive
    }
    }
}
};
</script>
  