<script setup>
import AccountHead from '../components/AccountHead.vue';
import AccountStats from '../components/AccountStats.vue';
import AccountInventory from '../components/AccountInventory.vue';
</script>

<template>
    <div class="view account">
        <div class="account--top">
            <AccountHead/>
            <AccountStats/>
        </div>
        <AccountInventory/>
    </div> 
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';

export default {
    data() {
        return {
        userExists: false,
        currentUser:null,
        };
    },
    computed: {
        // Utilisation de la valeur calculée user provenant du script setup
        user() {
            const store = useStore();
            return computed(() => store.state.user).value;
        },
    },
    mounted() {
        this.currentUser = this.user;
        this.checkUserExists(this.currentUser);
    },
    methods: {
    checkUserExists(usr) {
        this.userExists = !!usr;
        if (!this.userExists) {
            this.$router.push('/login');
        }
        },
    },
};
</script>

