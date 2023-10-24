<template>
    <div class="stats--all">
        <div class="stats--head">
            <div class="stats--self">
                <p class="stats--self--title">Games Played</p>
                <p class="stats--self--txt">{{ randomUser.stats.gamesplayed }}</p>
            </div>

            <div class="stats--self">
                <p class="stats--self--title">Rounds Won</p>
                <p class="stats--self--txt">{{ randomUser.stats.roundswon }}</p>
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
        }
    }
</script>