<template>
    <div v-if="visible" class="confirmation-dialog">
      <div class="confirmation-dialog-content">
        <p>{{ message }}</p>
        <input type="text" v-model="textInput" />
      </div>
      <div class="confirmation-dialog-actions">
        <button @click="confirm">Valider</button>
        <button @click="cancel">Annuler</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: Boolean, // Pour afficher ou masquer la boîte de dialogue
      randomUser: Object
    },
    data() {
      return {
        textInput: '', // Le texte à modifier
      };
    },
    computed: {
      message() {
        return `Confirmez-vous la modification suivante ?`;
      },
    },
    methods: {
      confirm() {
        this.$emit('confirmed', this.textInput);
        this.textInput = '';
      },
      cancel() {
        this.$emit('canceled');
        this.textInput = '';
      },
    },
  };
  </script>
  
  <style scoped>
  .confirmation-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .confirmation-dialog-content {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    max-width: 300px;
    text-align: center;
  }
  
  .confirmation-dialog-actions {
    margin-top: 10px;
  }
  
  .confirmation-dialog button {
    margin: 0 10px;
  }
  </style>
  