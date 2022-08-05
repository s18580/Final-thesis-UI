import { defineStore } from 'pinia'

export const useUserStore = defineStore('UserStore', {
    state: () => {
        return {
            name: "",
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
        }
    },
    persist: true,
  })