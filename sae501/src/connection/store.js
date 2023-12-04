// store.js
import { createStore } from 'vuex';
import axios from 'axios'; // Importez axios ici
import CryptoJS from 'crypto-js'; // Importez la librairie de hachage (par exemple, crypto-js)

const store = createStore({
  state() {
    return {
      user: null,
      isAuthenticated: false,
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
        try {
          
          const userData = {
            email: email,
            password: password,
            roles: ['ROLE_USER']
          };
      
          // Effectuer la requête pour se connecter
          const loginResponse = await axios.post('http://127.0.0.1:8000/api/login', userData);
      
          // Récupérer l'utilisateur depuis la réponse de la connexion
          const user = loginResponse.data;
          user.isAuthenticated = true;
      
          // Récupérer l'inventaire de l'utilisateur en utilisant l'ID de l'utilisateur
          const inventoryResponse = await axios.get(`http://127.0.0.1:8000/api/inventories?user=${user.id}`);
          const inventory = inventoryResponse.data;
      
          // Ajouter l'inventaire à l'objet utilisateur
          user.inventory = inventory;

          console.log('Contenu de inventory :', inventory);
      
          // Stocker les informations de l'utilisateur dans le state Vuex
          commit('setUser', user);
      
          // Vous pouvez également enregistrer les informations dans localStorage ou sessionStorage
          localStorage.setItem('user', JSON.stringify(user));
      
          // Retourner les données de l'utilisateur avec l'inventaire si nécessaire
          return { user, inventory };
        } catch (error) {
          // En cas d'erreur (identifiants invalides, erreur de réseau, etc.), gérez l'erreur ici
          console.error('Login failed:', error);
          throw error; // Vous pouvez relancer l'erreur pour la gérer depuis le composant
        }
    },


    async logout({ commit }) {
        try {
            // Ici, vous pouvez appeler votre API ou effectuer des opérations nécessaires pour déconnecter l'utilisateur
            // Par exemple, effectuer une requête vers votre backend pour invalider la session
    
            // Réinitialisez l'état de l'utilisateur dans le store Vuex
            commit('logout');
    
            // Effacez également les données de l'utilisateur de localStorage ou sessionStorage
            localStorage.removeItem('user');
        } catch (error) {
            // En cas d'erreur lors de la déconnexion, gérez l'erreur ici
            console.error('Logout failed:', error);
            throw error; // Vous pouvez relancer l'erreur pour la gérer depuis le composant
        }
    },


    async register(_, { email, password }) {
        try {
          const userData = {
            email: email,
            password: password,
            roles: ['ROLE_USER']
          };
  
          const response = await axios.post('http://127.0.0.1:8000/api/users', userData);
  
          // Si l'inscription réussit, vous pouvez retourner les données de l'utilisateur ou gérer la réponse si nécessaire
          return response.data;
        } catch (error) {
          // En cas d'échec de l'inscription, gérez l'erreur ici
          console.error('Registration failed:', error);
          throw error; // Vous pouvez relancer l'erreur pour la gérer depuis le composant
        }
    },
  },
});

export default store;
