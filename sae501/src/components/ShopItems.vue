<template>
    <div class="shop--items">
        <div class="shop--items--self" v-for="(item, index) in items" :key="index">
            <img :src="item.picture" alt="item image" class="item--img">
            <div class="item--price">
                <p v-if="isItemBought(item.id)" class="item--already">Already Bought</p>
                <p v-if="!isItemBought(item.id)" class="item--price--txt" @click="addItemBoughtToInventory(item)">{{ item.price }}</p>
                <img v-if="!isItemBought(item.id)" src="../assets/icons/streamz_yellow.svg" alt="streamz" class="item--price--img">
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
    },
    data() {
        return {
            currentUser: null,
            items: [],
            todayItems: [],
        }
    },
    methods: {
        isItemBought(itemId) {
            if (this.currentUser && this.currentUser.inventory && Array.isArray(this.currentUser.inventory.items)) {
                // Vérifie si l'élément avec l'itemId est présent dans le tableau items
                const foundItem = this.currentUser.inventory.items.find(item => item.id === itemId);
                
                return !!foundItem; // Retourne true si l'élément est trouvé, sinon false
            } else {
                console.error('Current user or inventory items is undefined or not an array');
                return false; // Impossible de vérifier, retourne false par défaut
            }
        },
        async addItemBoughtToInventory(item){
            try {
                if (this.currentUser) {
                    const newItem = {
                        "name": item.name,
                        "price": item.price,
                        "picture": item.picture, 
                    }
                    console.log(this.currentUser.inventory)
                    this.currentUser.inventory.items.push(newItem);

                    const updatedUser = {
                        "streamz": this.currentUser.inventory.streamz - item.price,
                        "items": this.currentUser.inventory.items,
                        "username": this.currentUser.inventory.username,
                        "profilepicture": this.currentUser.inventory.profilepicture,
                        "gameswon": this.currentUser.inventory.gameswon,
                        "gamesplayed": this.currentUser.inventory.gamesplayed,
                        "user": `http://127.0.0.1:8000/api/users/${this.currentUser.id}`,
                    };

                    fetch(`http://127.0.0.1:8000/api/inventories/${this.user.inventory.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/ld+json',
                        },
                        body: JSON.stringify(updatedUser),
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.user.inventory = data;
                        this.$store.commit('setUser', this.user);
                        console.log('User items updated successfully:', data);
                    })
                    .catch(error => {
                        console.error('Error updating user items:', error);
                    });
                }
            } catch (error) {
                console.error('Error updating user inventory:', error);
            }
        }
    },
    mounted() {
        fetch('http://127.0.0.1:8001/api/items')
            .then(response => response.json())
            .then(data => {
                this.items = data['hydra:member'];
                console.log('Fetched items:', this.items);
            })
            .catch(error => {
                console.error('Error fetching items:', error);
                reject(error); // Reject the promise if there's an error
            });

        this.currentUser = this.user;
    }
}
</script>