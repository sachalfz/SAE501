<template>
    <div class="stats--all">
        <div class="stats--head">
            <div class="stats--self played">
                <p class="stats--self--title">Games Played</p>
                <p class="stats--self--txt">{{ this.user.inventory.gamesplayed }}</p>
            </div>

            <div class="stats--self won">
                <p class="stats--self--title">Games Won</p>
                <p class="stats--self--txt">{{ this.user.inventory.gameswon }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex'

export default {
    computed: {
        // Utilisation de la valeur calculée user provenant du script setup
        user() {
        const store = useStore();
        return computed(() => store.state.user).value;
        },
    }
}
</script>