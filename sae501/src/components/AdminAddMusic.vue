<!-- AdminAddMusic.vue -->
<template>
    <div>
        <form @submit.prevent="handleAddMusic" class="login--form">
            <div class="form--row">
                <label for="projectName" class="form--label">Project Name:</label>
                <input class="form--input" type="text" id="projectName" placeholder="Ex: Destin" v-model="formData.projectName" required>
            </div>
            <div class="form--row">
                <label for="artistName" class="form--label">Artist Name:</label>
                <input class="form--input" type="text" placeholder="Ex: Ninho" id="artistName" v-model="formData.artistName" required>
            </div>
            <div class="form--row">
                <label for="year" class="form--label">Date:</label>
                <input class="form--input" type="text" id="year" v-model="formData.year" pattern="\d{4}" placeholder="Ex: 2023" required>
            </div>
            <div class="form--row">
                <label for="certification" class="form--label">Certification:</label>
                <input class="form--input" type="text" placeholder="Ex: Platine" id="certification" v-model="formData.certification">
            </div>
            <div class="form--row">
                <label for="label" class="form--label">Label:</label>
                <input class="form--input" type="text" placeholder="Ex: REC118" id="label" v-model="formData.label">
            </div>
            <div class="form--row">
                <label for="coverLink" class="form--label">Cover Link:</label>
                <input class="form--input" type="text" placeholder="Ex: https://amazon.fr/..." id="coverLink" v-model="formData.coverLink" required>
            </div>

            <button class="form--submit" type="submit">Add Music</button>

            <div v-if="showNotification" class="notification true">
                Music registered, redirection to home page in 3 seconds
            </div>
        </form>
    </div>
</template>

<script>
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
                year: '',
            },
            showNotification: false,
        };
    },
    methods: {
        async handleAddMusic() {
            try {
                const response = await axios.post('https://music.mmi-limoges.fr/api/alba', {
                    name: this.formData.projectName,
                    artist: this.formData.artistName,
                    date: parseInt(this.formData.year),
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
                console.log('Server Response:', error.response); // Ajout de cette ligne
                this.errorMessage = error.message || 'Music Registration failed';
            }
        },
    },
};
</script>
