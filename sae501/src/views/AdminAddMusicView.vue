<!-- AdminAddMusicView.vue -->
<template>
    <div>
      <h2>Admin Add Music View</h2>
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
        if (user.roles.includes('ROLE_ADMIN') || (user.roles.includes('ROLE_USER') && user.roles.includes('ROLE_ADMIN'))) {
            // Rediriger vers la page /login
            this.$router.push('/login');
        }
    },
}
</script>
  