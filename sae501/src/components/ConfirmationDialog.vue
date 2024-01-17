<template>
    <div v-if="visible" class="confirmation-dialog">
      <div class="confirmation-dialog-content">
        <p>{{ message }}</p>
        <input type="text" placeholder="Exemple: Guest" v-model="textInput" class="confirmation-dialog-content-form"/>
      </div>
      <div class="confirmation-dialog-actions">
        <button @click="confirm" class="confirmation--btn true">Rename</button>
        <button @click="cancel" class="confirmation--btn false">Exit</button>
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
        return `Veuillez choisir un nouveau nom d'utilisateur`;
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
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    max-width: 300px;
    text-align: center;
    border-radius: 5px;
    background-color: hsla(var(--clr-light));
    color: hsla(var(--clr-dark));
  }

  .confirmation-dialog-content-form{
    border: none;
    border-radius: 5px;
    font-size: var(--fs-14);
    width: 100%;
    padding: 0.2rem 0.5rem;
  }
  
  .confirmation-dialog-actions {
    margin-top: 10px;
  }
  
  .confirmation-dialog button {
    margin: 0 10px;
  }
  </style>
  