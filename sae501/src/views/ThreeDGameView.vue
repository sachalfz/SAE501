<script setup>
    import RedirectionPage from '../components/RedirectionPage.vue';
    import ThreeDAll from '../components/ThreeDAll.vue';
</script>
    
<template>
    <div class="view threed">
        <ThreeDAll v-if="windowWidth > 1300"/>
        <RedirectionPage v-else/>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            windowWidth: window.innerWidth,
            };
        },
        props: {
            randomUser: Object,
        },
        mounted() {
            window.addEventListener('resize', this.handleResize);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.handleResize);
        },
        methods: {
            handleResize() {
            this.windowWidth = window.innerWidth;
            },
        },
    };
</script>