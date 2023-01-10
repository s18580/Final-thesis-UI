import { defineStore } from 'pinia'
import jwt_decode from "jwt-decode";

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
            try{
                let decodedToken = jwt_decode(this.userToken);
                let expDate = new Date(decodedToken.exp*1000);
                let currentDate = new Date();

                if(expDate < currentDate) return false; //check if date is valid

            }catch(err) {
                return false;
            }

            return true;
        },
    },

    actions: {
        doesUserHasRole(role) {
            return this.roles.includes(role);
        },
        resetUserData() {
            this.id = null;
            this.name = "";
            this.token = "";
            this.refreshToken = "";
            this.roles = [];
        }
    },
    persist: true,
  })