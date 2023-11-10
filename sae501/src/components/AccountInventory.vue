<template>
    <div class="inventory--all">
        <div class="inventory--header">
            <p class="inventory--header--txt">Your Items</p>
        </div>
        <div class="inventory--items">
            <div class="inventory--items--self" v-for="(item, index) in inventory.items" :key="index">
            <img :src="item.picture" alt="item image" class="item--img">
            <div class="item--price">
                <!-- <p v-if="isItemEquiped(item.id)">Already Equiped</p>
                <p v-if="!isItemEquiped(item.id)" class="item--price--txt" @click="emitItemEquiped(item)">Use</p> -->
                <p class="item--equip--txt" @click="emitItemEquiped(item)">USE</p>
            </div>
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