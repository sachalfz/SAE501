// store.js
import { createStore } from 'vuex';
import axios from 'axios'; // Importez axios ici

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
      state.isAuthenticated = !!user; // Mettre à jour l'état d'authentification en fonction de la présence de l'utilisateur
  
      if (user) {
        localStorage.setItem('user', JSON.stringify(user)); // Stocker les informations de l'utilisateur dans LocalStorage
      } else {
        localStorage.removeItem('user'); // Supprimer les informations de l'utilisateur si l'utilisateur est déconnecté
      }
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  actions: {

    initializeApp({ commit }) {
      const user = localStorage.getItem('user');
      if (user) {
        commit('setUser', JSON.parse(user));
      }
    },

    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/login', {
          email: email,
          password: password
        });
        
        // Récupérer l'utilisateur depuis la réponse de la connexion
        const user = response.data.user;
        user.isAuthenticated = true;
    
        // Récupérer l'inventaire de l'utilisateur en utilisant l'ID de l'utilisateur
        const inventoryResponse = await axios.get(`http://127.0.0.1:8000/api/inventory/${user.id}`);
        const inventory = inventoryResponse.data.inventory;
    
        // Ajouter l'inventaire à l'objet utilisateur
        user.inventory = inventory;
    
        // Stocker les informations de l'utilisateur dans le state Vuex
        commit('setUser', user);
    
        // Vous pouvez également enregistrer les informations dans localStorage ou sessionStorage
        localStorage.setItem('user', JSON.stringify(user));
    
        // Retourner les données de l'utilisateur avec l'inventaire si nécessaire
        return { user, inventory };
        
      } catch (error) {
        console.error('Login failed:', error.response.data.message);
        throw error; // Gérer l'échec de connexion depuis le composant qui appelle cette action
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
        if (error.response) {
          if (error.response.status === 400) {
            // Erreur 400 (Bad Request) - Email déjà utilisé
            throw new Error('Email already taken'); // Message pour une erreur 400
          } else if (error.response.status === 500) {
            // Erreur 500 (Internal Server Error)
            throw new Error('Internal server error'); // Message pour une erreur 500
          }
        }
        // Autres erreurs non gérées
        throw error;
      }
    }
  },

  getters: {
    getUser(state) {
      return state.user;
    },
    getInventory(state) {
      return state.inventory;
    },
    // Autres getters
  },
});

export default store;
