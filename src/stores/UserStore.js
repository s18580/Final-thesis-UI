import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
    state: () => {
        return {
            id: null,
            name: "",
            token: "",
            refreshToken: "",
            roles: [],
        }
    },

    getters: {
        userId() {
            return this.id;  
        },
        userName() {
            return this.name;
        },
        userRoles() {
            return this.roles;
        },
        userToken() {
            return this.token;
        },
        isUserAuthenticated() {
            if(this.userToken) {
                return true;
            }else{
                return false;
            }
        },
    },

    actions: {
        doesUserHasRole(role) {
            return this.roles.includes(role);
        },
    },
    persist: true,
  })