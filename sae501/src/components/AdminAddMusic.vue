<!-- AdminAddMusic.vue -->
<template>
    <div>
        <form @submit.prevent="handleAddMusic" class="login--form">
            <div class="form--row">
                <label for="projectName" class="form--label">Nom du projet:</label>
                <input class="form--input" type="text" id="projectName" placeholder="Ex: Destin" v-model="formData.projectName" required>
            </div>
            <div class="form--row">
                <label for="artistName" class="form--label">Nom de l'artiste:</label>
                <input class="form--input" type="text" placeholder="Ex: Ninho" id="artistName" v-model="formData.artistName" required>
            </div>
            <div class="form--row">
                <label for="year" class="form--label">Année:</label>
                <input class="form--input" type="text" id="year" v-model="formData.year" pattern="\d{4}" placeholder="Ex: 2023" required>
            </div>
            <div class="form--row">
                <label for="certification" class="form--label">Certification:</label>
                <input class="form--input" type="text" placeholder="Ex: Platine" id="certification" v-model="formData.certification">
            </div>
            <div class="form--row">
                <label for="label" class="form--label">Label:</label>
                <input class="form--input" type="text" placeholder="Ex: REC118" id="label" v-model="formData.label" required>
            </div>
            <div class="form--row">
                <label for="coverLink" class="form--label">Lien de la cover:</label>
                <input class="form--input" type="text" placeholder="Ex: https://amazon.fr/..." id="coverLink" v-model="formData.coverLink" required>
            </div>

            <button class="form--submit" type="submit">Ajouter</button>

            <div v-if="showNotification" class="notification true">
                Music registered, redirection to home page in 3 seconds
            </div>
        </form>
    </div>
</template>

<script>
import { apiMusic } from '@/main.js';
import axios from 'axios';

export default {
    data() {
        return {
            formData: {
                projectName: '',
                artistName: '',
                certification: '',
                label: '',
                coverLink: '',
                year: 0,
            },
        };
    },
    methods: {
        async handleAddMusic() {
            try {
                const response = await axios.post(`${apiMusic}/api/alba`, {
                    name: this.formData.projectName,
                    artist: this.formData.artistName,
                    date: this.formData.year,
                    label: this.formData.label,
                    beatmakers: [],
                    cover: this.formData.coverLink,
                    certification: this.formData.certification,
                });

                console.log('Music registered:', response);
                this.showNotification = true;
                // Définir un délai pour masquer automatiquement la notification après quelques secondes
                setTimeout(() => {
                    this.showNotification = false;
                    this.$router.push('/');
                }, 3000); // Par exemple, 3000 ms (3 secondes)
                return;
                // Redirection ou traitement suite à l'inscription réussie
            } catch (error) {
                console.error('Music Registration failed:', error);
                // Afficher le message d'erreur reçu du serveur
                this.errorMessage = error.message || 'Music Registration failed'; // Utilisation du message d'erreur renvoyé par le serveur
            }
        },
    },
};
</script>
