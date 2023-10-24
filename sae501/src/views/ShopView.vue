<script setup>
    import ShopHead from "../components/ShopHead.vue"
    import ShopItems from "../components/ShopItems.vue"
</script>

<script>
export default {
    data() {
        return {
            items:[],
        }
    },
    props: {
        randomUser: Object,
        inventory: Object,
    },
    mounted() {
        // Charger le tableau d'albums à partir du fichier JSON
        fetch('./assets/shopitems.json')
        .then(response => response.json())
        .then(data => {
            this.items = data;
        });
    }
};
</script>

<template>
    <div class="view shop">
        <ShopHead :randomUser="randomUser" :inventory="inventory"/>
        <ShopItems :randomUser="randomUser" :items="items" />
    </div>
    
</template>

