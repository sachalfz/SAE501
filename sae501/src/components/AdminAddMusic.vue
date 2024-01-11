<!-- AdminAddMusic.vue -->
<template>
    <div>
      <!-- Votre formulaire pour ajouter des données -->
      <form @submit.prevent="handleSubmit">
        <!-- Les champs de votre formulaire -->
        <!-- ... -->
        <button type="submit">Ajouter</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      handleSubmit() {
        // Logique pour gérer l'ajout des données
      }
    }
  }
  </script>
  