<script setup>
    import ShopHead from "../components/ShopHead.vue"
    import ShopItems from "../components/ShopItems.vue"
    import { ref } from 'vue';
</script>

<script>
export default {
    data() {
        return {
            items: [],
            todayItems: [],
        }
    },
    props: {
        randomUser: Object,
        inventory: Object,
        basePath: String,
    },
    mounted() {
        // Fetch initial items
        this.fetchItems()
        .then(() => {
            // Check if todayItems is empty and assign random items
            if (this.todayItems.length == 0) {
                this.todayItems = this.getRandomItems(this.items, 4);
            }

            // Calculate the time remaining until midnight
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0); // Set to midnight of the current day
            const timeRemaining = midnight - now;

            console.log("today's", this.todayItems);

            // Schedule a function to fetch new items at midnight
            setTimeout(() => {
                this.fetchItems()
                    .then(() => {
                        this.todayItems = this.getRandomItems(this.items, 4);
                        // Call the function again to schedule for the next midnight
                        this.scheduleMidnightFetch();
                    })
                    .catch(error => {
                        console.error('Error fetching items:', error);
                    });
            }, timeRemaining);
        })
        .catch(error => {
            console.error('Error fetching initial items:', error);
        });

    },
    methods: {
        fetchItems() {
            // Return a Promise
            return new Promise((resolve, reject) => {
                fetch('http://127.0.0.1:8001/api/items')
                    .then(response => response.json())
                    .then(data => {
                        this.items = data['hydra:member'];
                        console.log('Fetched items:', this.items);
                        resolve();  // Resolve the promise when fetching is successful
                    })
                    .catch(error => {
                        console.error('Error fetching items:', error);
                        reject(error); // Reject the promise if there's an error
                    });
            });
        },
        
        getRandomItems(array, count) {
            // Function to select 'count' random items from the array
            const shuffled = array.slice(0);
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled.slice(0, count);
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
            this.todayItems = this.getRandomItems(this.items, 4)
            // Call the function again to schedule for the midnight after the next
            this.scheduleMidnightFetch();
            }, timeRemaining);
        },

        addItemToInventory(item){

            // Ensure that this.inventory.items is initialized as a ref
            if (!this.inventory.items) {
                // Initialize it as an empty array wrapped in a ref
                this.inventory.items = [];
            }

            this.inventory.items.push(item);

            const updatedUserInventory = {
                "streamz": this.inventory.streamz,
                "items": this.inventory.items,
                "username": this.inventory.username,
                "profilePicture": this.inventory.profile_picture,
                "gamesWon": this.inventory.games_won,
                "gamesPlayed": this.inventory.games_played,
                "idUser": this.inventory.id_user
            }; // Créez un objet avec la nouvelle valeur du username

            // Utilisez fetch pour effectuer la mise à jour
            fetch(`http://127.0.0.1:8001/api/inventories/${this.inventory.id}`, {
                method: 'PUT', // Utilisez la méthode PUT
                headers: {
                    'Content-Type': 'application/ld+json', // Spécifiez le type de contenu JSON
                },
                body: JSON.stringify(updatedUserInventory),
            })
            .then(response => response.json())
            .then(data => {
                this.inventory.items.value = data.items;
            })
        },

        handleItemBought(item) {
            this.addItemToInventory(item);
        }
    },
};
</script>

<template>
    <div class="view shop">
        <ShopHead :randomUser="randomUser" :inventory="inventory"/>
        <ShopItems :randomUser="randomUser" :items="items" :todayItems="todayItems" :inventory="inventory" @itemBought="handleItemBought"/>
    </div>
    
</template>

