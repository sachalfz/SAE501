<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="handleRegister">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
        
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
        
        <button type="submit">Register</button>
      </form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
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
        // Gestion de l'échec d'inscription
      }
    },
  },
};
</script>
  