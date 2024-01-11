<!-- AdminAddMusic.vue -->
<template>
    <div>
        <form @submit.prevent="handleAddItem" class="login--form">
            <div class="form--row">
                <label for="itemName" class="form--label">Item Name:</label>
                <input class="form--input" type="text" id="itemName" placeholder="Ex: Mario Killer" v-model="formData.itemName" required>
            </div>
            <div class="form--row">
                <label for="itemDescription" class="form--label">Item Description:</label>
                <input class="form--input" type="text" placeholder="Ex: Amazing Profile Picture" id="itemDescription" v-model="formData.itemDescription" required>
            </div>
            <div class="form--row">
                <label for="itemPrice" class="form--label">Item Price:</label>
                <input class="form--input" type="text" id="itemPrice" v-model="formData.itemPrice" pattern="\d{4}" placeholder="Ex: 1500" required>
            </div>
            <div class="form--row">
                <label for="itemPicture" class="form--label">Item Picture:</label>
                <input class="form--input" type="text" placeholder="Ex: https://mmi2105.mmi-limoges.fr/..." id="itemPicture" v-model="formData.itemPicture" required>
            </div>

            <button class="form--submit" type="submit">Add Item</button>

            <div v-if="showNotification" class="notification true">
                Shop Item registered, redirection to home page in 3 seconds
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            formData: {
                itemName: '',
                itemDescription: '',
                itemPrice: '',
                itemPicture: '',
            },
            showNotification: false,
        };
    },
    methods: {
        async handleAddItem() {
            try {
                const response = await axios.post('https://shop.mmi-limoges.fr/api/items', {
                    name: this.formData.itemName,
                    description: this.formData.itemDescription,
                    price: parseInt(this.formData.itemPrice),
                    picture: this.formData.itemPicture,
                }, {
                    headers: {
                        'Content-Type': 'application/ld+json',
                    },
                });

                console.log('Shop Item registered:', response);
                this.showNotification = true;
                // Définir un délai pour masquer automatiquement la notification après quelques secondes
                setTimeout(() => {
                    this.showNotification = false;
                    this.$router.push('/');
                }, 3000); // Par exemple, 3000 ms (3 secondes)
                return;
                // Redirection ou traitement suite à l'inscription réussie
            } catch (error) {
                console.error('Music Registration failed:', error);
                console.log('Server Response:', error.response); // Ajout de cette ligne
                this.errorMessage = error.message || 'Shop Item Registration failed';
            }
        },
    },
};
</script>
