<template>
    <div class="account--head">
        <img :src="this.user.inventory.profilepicture" alt="profile pic" class="account--head--profilepic">
        <div class="account--head--username">
            <div class="username--actual">
                <p class="username--surtitle">Actual Username</p>
                <div class="username--all">
                    <p class="username--txt">{{ this.user.inventory.username }}</p> 
                    <img src="../assets/icons/pen_light.svg" alt="modify" class="username--modify" @click="openConfirmationDialog"> 
                </div>
            </div>
            <ConfirmationDialog :visible="confirmationDialogVisible" @confirmed="confirmModification" @canceled="cancelModification" />
        </div>
    </div>
</template>

<script>
import ConfirmationDialog from './ConfirmationDialog.vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex'

export default {
    components: {
        ConfirmationDialog,
    },
    data() {
        return {
            textInput: '', // Le texte saisi sera stocké ici
            confirmationDialogVisible: false,
            currentUser: null,
        };
    },
    computed: {
        // Utilisation de la valeur calculée user provenant du script setup
        user() {
        const store = useStore();
        return computed(() => store.state.user).value;
        },
    },
    mounted() {
        this.currentUser = this.user;
    },                                                  
    methods: {
        openConfirmationDialog() {
            this.confirmationDialogVisible = true;
        },
        async confirmModification(newUsername) {
            try {
                const updatedUser = {                
                    "streamz": this.currentUser.inventory.streamz,
                    "items": this.currentUser.inventory.items,
                    "username": newUsername,
                    "profilepicture": this.currentUser.inventory.profilepicture,
                    "gameswon": this.currentUser.inventory.gameswon,
                    "gamesplayed": this.currentUser.inventory.gamesplayed,
                    "user": `http://127.0.0.1:8000/api/users/${this.currentUser.id}`,
                }; // Créez un objet avec la nouvelle valeur du username

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
                        console.log('User inventory updated successfully:', data);
                    })
            } catch (error) {
                console.error('Error:', error);
            }
            },
        cancelModification(){
            this.confirmationDialogVisible = false;
        },
    },
};
</script>



