<!-- AdminAddMusicView.vue -->
<template>
    <div class="view admin">
      <h2 class="login--title">Add Music</h2>
      <AdminAddMusic />
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AdminAddMusic from '../components/AdminAddMusic.vue'; // Assurez-vous d'ajuster le chemin correctement

export default {
    components: {
        AdminAddMusic
    },
    computed: {
        // Utilisation de la valeur calculée user provenant du script setup
        user() {
        const store = useStore();
        return computed(() => store.state.user).value;
        },
    },
    mounted() {
        // Vérifier si l'utilisateur n'a pas le rôle admin
        if (this.user.roles.includes('ROLE_ADMIN') || (this.user.roles.includes('ROLE_USER') && this.user.roles.includes('ROLE_ADMIN'))) {
            // Rediriger vers la page /login
            this.$router.push('/login');
        }
    },
}
</script>
  