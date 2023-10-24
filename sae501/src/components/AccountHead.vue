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
        confirmModification(newusername) {
            this.randomUser.username = newusername;
            this.confirmationDialogVisible = false;
        },
        cancelModification(){
            this.confirmationDialogVisible = false;
        },
        handleFormSubmit() {
        // Cette méthode est appelée lors de la soumission du formulaire
        // Vous pouvez également afficher la boîte de dialogue ici
        this.openConfirmationDialog();
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

