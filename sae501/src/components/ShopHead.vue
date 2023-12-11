<template>
    <div class="shop--head">
        <div class="shop--refresh">
            <p class="shop--refresh--txt">Shop refreshes in :</p>
            <p class="shop--refresh--time">{{ timeLeft.hours }}h {{ timeLeft.minutes }}m {{ timeLeft.seconds }}s</p>
        </div>

        <div class="shop--credits">
            <p class="shop--credits--txt">Your Streamz :</p>
            <div class="shop--credits--amount">
                <p class="credits--amount--number">{{this.user.inventory.streamz}}</p>
                <img src="../assets/icons/streamz_yellow.svg" class="credits--amount--icon" alt="credits"/>
            </div>    
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex'

export default {
    data() {
        return {
        timeLeft: {
            hours: 0,
            minutes: 0,
            seconds: 0,
        },
        };
    },
    computed: {
        // Utilisation de la valeur calculée user provenant du script setup
        user() {
            const store = useStore();
            return computed(() => store.state.user).value;
        },
    },
    mounted() {
        this.updateCountdown();
    },
    methods: {
        calculateTimeUntilEndOfDay() {
            const now = new Date();
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            const timeDifference = endOfDay - now;

            const hours = Math.floor(timeDifference / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            return { hours, minutes, seconds };
        },
        updateCountdown() {
            this.timeLeft = this.calculateTimeUntilEndOfDay();

            setTimeout(this.updateCountdown, 1000);
        },
    },
}
</script>