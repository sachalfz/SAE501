<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required>
      
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required>
      
      <button type="submit">Register</button>
      
      <!-- Affichage du message d'erreur -->
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </form>
    <!-- Texte pour se connecter si l'utilisateur a déjà un compte -->
    <p>Already have an account? <router-link to="/login">Log in</router-link></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', // Variable pour stocker le message d'erreur
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await this.$store.dispatch('register', {
          email: this.email,
          password: this.password,
        });
        console.log('User registered:', response);
        // Redirection ou traitement suite à l'inscription réussie
      } catch (error) {
        console.error('Registration failed:', error);
        // Afficher le message d'erreur reçu du serveur
        this.errorMessage = error.message || 'Registration failed'; // Utilisation du message d'erreur renvoyé par le serveur
      }
    },
  },
};
</script>
