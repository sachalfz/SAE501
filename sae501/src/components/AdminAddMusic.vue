<!-- AdminAddMusic.vue -->
<template>
    <div>
        <form @submit.prevent="handleSubmit" class="login--form">
            <div class="form--row">
                <label for="projectName" class="form--label">Nom du projet:</label>
                <input class="form--input" type="text" id="projectName" placeholder="Ex: Destin" v-model="formData.projectName" required>
            </div>
            <div class="form--row">
                <label for="artistName" class="form--label">Nom de l'artiste:</label>
                <input class="form--input" type="text" placeholder="Ex: Ninho" id="artistName" v-model="formData.artistName" required>
            </div>
            <div class="form--row">
                <label for="certification" class="form--label">Certification:</label>
                <input class="form--input" type="text" placeholder="Ex: Platine" id="certification" v-model="formData.certification" required>
            </div>
            <div class="form--row">
                <label for="label" class="form--label">Label:</label>
                <input class="form--input" type="text" placeholder="Ex: REC118" id="label" v-model="formData.label" required>
            </div>
            <div class="form--row">
                <label for="coverLink" class="form--label">Lien de la cover:</label>
                <input class="form--input" type="text" placeholder="Ex: https://amazon.fr/..." id="coverLink" v-model="formData.coverLink" required>
            </div>
            <div class="form--row">
                <label for="year" class="form--label">Année:</label>
                <input class="form--input" type="text" id="year" v-model="formData.year" pattern="\d{4}" placeholder="Ex: 2023" required>
            </div>
            <button class="form--submit" type="submit">Ajouter</button>
        </form>
    </div>
</template>

<script>
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
        };
    },
    methods: {
        handleSubmit() {
            // Logique pour gérer l'ajout des données
            // Utilisez this.formData pour accéder aux valeurs des champs
        },
    },
};
</script>
