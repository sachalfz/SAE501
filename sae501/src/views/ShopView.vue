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
        basePath: String,
    },
    mounted() {
        // Fetch initial items
        this.fetchItems();

        // Calculate the time remaining until midnight
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0); // Set to midnight of the current day
        const timeRemaining = midnight - now;

        // Schedule a function to fetch new items at midnight
        setTimeout(() => {
            this.fetchItems();
            // Call the function again to schedule for the next midnight
            this.scheduleMidnightFetch();
        }, timeRemaining);
    },
    methods: {
        fetchItems() {
            fetch('http://127.0.0.1:8003/api/items')
            .then(response => response.json())
            .then(data => {
                this.items = data['hydra:member'];
                console.log('Fetched items:', this.items);
            })
            .catch(error => {
                console.error('Error fetching items:', error);
            });
        },

        scheduleMidnightFetch() {
            // Calculate the time remaining until the next midnight
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0); // Set to midnight of the next day
            const timeRemaining = midnight - now;

            // Schedule a function to fetch new items at the next midnight
            setTimeout(() => {
            this.fetchItems();
            // Call the function again to schedule for the midnight after the next
            this.scheduleMidnightFetch();
            }, timeRemaining);
        },
    },
};
</script>

<template>
    <div class="view shop">
        <ShopHead :randomUser="randomUser" :inventory="inventory"/>
        <ShopItems :randomUser="randomUser" :items="items" />
    </div>
    
</template>

