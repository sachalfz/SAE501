<script setup>
import ConfirmationDialog from './ConfirmationDialog.vue';
</script>

<script>
export default {
    data() {
        return {
        textInput: '', // Le texte saisi sera stocké ici
        confirmationDialogVisible: false,
        };
    },
    props: {
        randomUser: Object,
        inventory: Object,
    },
    methods: {
        openConfirmationDialog() {
            this.confirmationDialogVisible = true;
        },
        confirmModification(newUsername) {
            const updatedUser = { username: newUsername }; // Créez un objet avec la nouvelle valeur du username

            // Utilisez fetch pour effectuer la mise à jour
            fetch(`http://127.0.0.1:8001/api/inventories/${this.inventory.id}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/merge-patch+json', // Spécifiez le type de contenu Hydra
                },
                body: JSON.stringify(updatedUser),
            })
                .then(response => response.json())
                .then(data => {
                // Mettez à jour l'objet local si nécessaire
                this.inventory.username = data.username;
                console.log('Mise à jour réussie :', data);
                })
                .catch(error => {
                console.error('Erreur de mise à jour :', error);
                });

            this.confirmationDialogVisible = false;
        },
        cancelModification(){
            this.confirmationDialogVisible = false;
        },
        updateUsername(newUsername) {
            const updatedUser = { username: newUsername }; // Créez un objet avec la nouvelle valeur du username

            // Utilisez la méthode fetch pour effectuer la mise à jour
            fetch(`http://127.0.0.1:8001/api/inventories/${this.inventory.id}`, {
            method: 'PATCH', // Utilisez 'PATCH' pour une mise à jour partielle
            headers: {
                'Content-Type': 'application/json', // Indiquez que vous envoyez des données JSON
            },
            body: JSON.stringify(updatedUser), // Convertissez l'objet en JSON
            })
            .then(response => {
                if (!response.ok) {
                throw new Error('Échec de la mise à jour');
                }
                return response.json();
            })
            .then(data => {
                // Mettez à jour l'objet local si nécessaire
                this.inventory.username = data.username;
                console.log('Mise à jour réussie :', data);
            })
            .catch(error => {
                console.error('Erreur de mise à jour :', error);
            });
        },
    },
};
</script>

<template>
    <div class="account--head">
        <img :src="this.inventory.profile_picture" alt="profile pic" class="account--head--profilepic">
        <div class="account--head--username">
            <div class="username--actual">
                <p class="username--surtitle">Actual Username</p>
                <div class="username--all">
                    <p class="username--txt">{{ this.inventory.username }}</p> 
                    <img src="../assets/icons/pen_light.svg" alt="modify" class="username--modify" @click="openConfirmationDialog"> 
                </div>
            </div>
            <ConfirmationDialog :visible="confirmationDialogVisible" @confirmed="confirmModification" @canceled="cancelModification" />
        </div>
    </div>
</template>

