<template>
    <div>
      <h1>Logout</h1>
      <p>Are you sure you want to logout?</p>
      <button @click="handleLogout">Logout</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      async handleLogout() {
        try {
          await this.$store.dispatch('logout');
  
          // Si la déconnexion réussit, l'utilisateur est déconnecté avec succès
          console.log('User logged out');
  
          // Rediriger l'utilisateur vers une autre page après la déconnexion réussie
          this.$router.push('/');
        } catch (error) {
          // En cas d'échec de la déconnexion, gérez l'erreur ici
          console.error('Logout failed:', error);
          // Afficher un message d'erreur à l'utilisateur ou gérer l'erreur en conséquence
        }
      },
    },
  };
  </script>
  