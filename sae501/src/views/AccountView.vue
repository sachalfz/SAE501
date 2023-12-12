<script setup>
import AccountHead from '../components/AccountHead.vue';
import AccountStats from '../components/AccountStats.vue';
import AccountInventory from '../components/AccountInventory.vue';
</script>

<template>
    <div class="view account">
        <div class="account--top">
            <AccountHead/>
            <AccountStats/>
        </div>
        <AccountInventory/>
    </div> 
</template>

