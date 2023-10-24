<script setup>
import AccountHead from '../components/AccountHead.vue';
import AccountStats from '../components/AccountStats.vue';
</script>

<script>
export default {
    props: {
        randomUser: Object,
    },
};
</script>

<template>
    <div class="view account">
        <AccountHead :randomUser="randomUser" />
        <AccountStats :randomUser="randomUser" />
    </div>
    
</template>

