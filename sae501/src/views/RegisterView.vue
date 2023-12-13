<template>
  <div class="view register">
    <h1 class="login--title">Register</h1>

    <form @submit.prevent="handleRegister" class="login--form">
      <div class="form--row">
        <label for="email" class="form--label">Email:</label>
        <input type="email" id="email" v-model="email" class="form--input" required>
      </div>

      <div class="form--row">
        <label for="password" class="form--label">Password:</label>
        <input type="password" id="password" v-model="password" class="form--input" required>
      </div>
      <button type="submit" class="form--submit">Register</button>
      
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </form>

    <p class="form--redirect">Already have an account? <router-link to="/login">Log in</router-link></p>
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
