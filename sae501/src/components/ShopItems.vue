<template>
    <div class="shop--items">
        <div class="shop--items--self" v-for="(item, index) in todayItems" :key="index">
            <img :src="item.picture" alt="item image" class="item--img">
            <div class="item--price">
                <p v-if="isItemBought(item.id)" class="item--already">Already Bought</p>
                <p v-if="!isItemBought(item.id)" class="item--price--txt" @click="emitItemBought(item)">{{ item.price }}</p>
                <img v-if="!isItemBought(item.id)" src="../assets/icons/streamz_yellow.svg" alt="streamz" class="item--price--img">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            items: Array,
            todayItems: Array,
            randomUser: Object,
            inventory: Object,
        },
        methods: {
            emitItemBought(item) {
                // Émettre un événement vers le composant parent avec les informations de l'article
                this.$emit('itemBought', item);
            },
            isItemBought(itemId){
                // Vérifier si l'ID de l'élément est présent dans la liste des articles achetés
                if (this.inventory.items && typeof this.inventory.items[Symbol.iterator] === 'function') {
                    for (const elt of this.inventory.items) {
                        if (elt.id == itemId) {
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }
</script>