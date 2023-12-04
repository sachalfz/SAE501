<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <label for="email">Email:</label>
        <input type="text" id="email" v-model="email" required>
        
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
        
        <button type="submit">Login</button>
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
    async handleLogin() {
    try {
        const user = await this.$store.dispatch('login', {
        email: this.email,
        password: this.password,
        });

        // Si l'authentification réussit, l'utilisateur est connecté avec succès
        console.log('User logged in:', user);

        // Rediriger l'utilisateur vers une autre page après la connexion réussie
        this.$router.push('/');
    } catch (error) {
        // En cas d'échec de l'authentification, gérez l'erreur ici
        console.error('Login failed:', error);
        // Afficher un message d'erreur à l'utilisateur ou gérer l'erreur en conséquence
    }
    },
},
};
</script>
  