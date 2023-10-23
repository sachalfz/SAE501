<script setup>
import AccountHead from '../components/AccountHead.vue';
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
    </div>
    
</template>

