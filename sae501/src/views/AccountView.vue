<script setup>
import AccountHead from '../components/AccountHead.vue';
import AccountStats from '../components/AccountStats.vue';
import AccountInventory from '../components/AccountInventory.vue';
</script>

<template>
    <div class="view account" v-if="this.user">
        <div class="account--top">
            <!-- <AccountHead/>
            <AccountStats/> -->
        </div>
        <!-- <AccountInventory/> -->
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
        this.checkUserExists();
    },
    methods: {
    checkUserExists() {
        this.userExists = !!this.user;
        if (!this.userExists) {
            this.$router.push('/login');
        }
        },
    },
};
</script>

