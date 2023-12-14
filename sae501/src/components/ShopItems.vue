<template>
    <div v-if="showNotification" class="notification false">
        Not enough Streamz for this item
    </div>
    <div class="shop--items">
        <div class="shop--items--self" v-for="(item, index) in items" :key="index">
            <img :src="item.picture" alt="item image" class="item--img">
            <div class="item--price" v-if="isItemBought(item.id)">
                <p class="item--already">Already Bought</p>
            </div>
            <div class="item--price" v-if="!isItemBought(item.id)" @click="addItemBoughtToInventory(item)">
                <p class="item--price--txt">{{ item.price }}</p>
                <img src="../assets/icons/streamz_yellow.svg" alt="streamz" class="item--price--img">
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

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
            showNotification: false,
        }
    },
    methods: {
        isItemBought(itemId) {
            if (this.currentUser && this.currentUser.inventory && this.currentUser.inventory.items) {
                // Vérifie si l'élément avec l'itemId est présent dans le tableau items de l'inventaire de l'utilisateur
                for (const item of this.currentUser.inventory.items) {
                if (item.id === itemId) {
                    return true; // Retourne vrai si l'élément est trouvé
                }
                }
                return false; // Retourne faux si l'élément n'est pas trouvé
            } else {
                return false; // Impossible de vérifier, retourne false par défaut
            }
        },
        async addItemBoughtToInventory(item){
            try {
                if (this.currentUser) {
                    if (this.currentUser.inventory.streamz >= item.price) {
                        const newItem = {
                            "id": item.id,
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
                    } else {
                        // Affiche une notification indiquant à l'utilisateur qu'il n'a pas assez de fonds
                        this.showNotification = true;
                        // Définir un délai pour masquer automatiquement la notification après quelques secondes
                        setTimeout(() => {
                            this.showNotification = false;
                        }, 3000); // Par exemple, 3000 ms (3 secondes)
                        return;
                    }
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
            })
            .catch(error => {
                console.error('Error fetching items:', error);
                reject(error); // Reject the promise if there's an error
            });

        this.currentUser = this.user;
    }
}
</script>