import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
    state: () => {
        return {
            name: "Hubert Gołębiowski",
            userToken: "",
            userRefreshToken: "",
            roles: [],
        }
    },

    getters: {
        userName() {
            return this.name;
        },
        userRoles() {
            return this.roles;
        },
        isUserAuthenticated() {
            return true;
        }
    },

    actions: {
        
    },
    persist: true,
  })