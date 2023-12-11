<template>
    <div class="inventory--all">
        <div class="inventory--header">
            <p class="inventory--header--txt">Your Items</p>
        </div>
        <div class="inventory--items">
            <div class="inventory--items--self" v-for="(item, index) in this.user.inventory.items" :key="index">
            <img :src="item.picture" alt="item image" class="item--img">
            <div class="item--price">
                <p>test en attendant</p>
                <!-- <p class="item--equip--txt" @click="emitItemEquiped(item)">USE</p> -->
            </div>
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