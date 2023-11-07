<script setup>
import AccountHead from '../components/AccountHead.vue';
import AccountStats from '../components/AccountStats.vue';
</script>

<script>
export default {
    props: {
        randomUser: Object,
        inventory: Object,
        basePath: String,
    },
};
</script>

<template>
    <div class="view account">
        <AccountHead :randomUser="randomUser" :inventory="inventory"/>
        <AccountStats :randomUser="randomUser" :inventory="inventory"/>
    </div>
    
</template>

