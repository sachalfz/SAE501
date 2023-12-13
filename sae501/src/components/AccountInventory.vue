<template>
    <div class="inventory--all">
        <div class="inventory--header">
            <p class="inventory--header--txt">Your Items</p>
        </div>
        <div class="inventory--items">
            <div class="inventory--items--self" v-for="(item, index) in this.user.inventory.items" :key="index">
                <img :src="item.picture" alt="item image" class="item--img">
                <div class="item--price" v-if="isItemEquiped(item)">
                    <p class="item--equip--txt">Equiped</p>
                </div>
                <div class="item--price" v-if="!isItemEquiped(item)" @click="addItemToProfilePicture(item.picture)">
                    <p class="item--equip--txt">Use</p>
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
    },
    data() {
        return {
            currentUser: null,
        }
    },
    methods: {
        isItemEquiped(itemSelected) {
            return (
                this.currentUser &&
                this.currentUser.inventory &&
                this.currentUser.inventory.profilepicture &&
                itemSelected &&
                itemSelected.picture &&
                itemSelected.picture === this.currentUser.inventory.profilepicture
            ) ? true : false;
        },
        async addItemToProfilePicture(newProfilePic){
            try {
                if (this.currentUser) {
                    const updatedUser = {
                        "streamz": this.currentUser.inventory.streamz,
                        "items": this.currentUser.inventory.items,
                        "username": this.currentUser.inventory.username,
                        "profilepicture": newProfilePic,
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
                        console.log('User profile picture updated successfully:');
                    })
                    .catch(error => {
                        console.error('Error updating user profile picture:', error);
                    });
                }
            } catch (error) {
                console.error('Error updating user profile picture:', error);
            }
        }
    },
    mounted() {
        this.currentUser = this.user;
        console.log(this.currentUser.inventory.items)
    }
}
</script>