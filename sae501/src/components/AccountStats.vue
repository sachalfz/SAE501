<template>
    <div class="stats--all">
        <div class="stats--head">
            <div class="stats--self played">
                <p class="stats--self--title">Games Played</p>
                <p class="stats--self--txt">{{ this.inventory.games_played }}</p>
            </div>

            <div class="stats--self won">
                <p class="stats--self--title">Games Won</p>
                <p class="stats--self--txt">{{ this.inventory.games_won }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<script>
    export default {
        props:{
            randomUser: Object,
            inventory: Object,
        }
    }
</script>