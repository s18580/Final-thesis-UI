<template>
  <va-navbar color="primary" shape class="mb-2">
    <template #left>
      <va-navbar-item id="logo-container">
        <img id="logo" src = "../assets/logo.svg" alt="LOGO"/>
      </va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item>
        <div id="userMenu">
          <div class="btn-group">
            <div class="userPanel" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
              <va-avatar color="#6B5B95" class="mr-2" icon="face" />
              <div id="user-data">
                <span class="fs-6" id="user-name">{{ userName }}</span>
              </div>
            </div>
            <HelpModal v-model="showHelpModal" @close="closeHelpModal()" />
            <AccountModal v-model="showAccountModal" @close="closeAccountModal()" />
            <ul class="dropdown-menu start-25 ml-3 mt-1 moveUserMenu" aria-labelledby="defaultDropdown" data-popper-placement="bottom-end">
              <li @click="openAccountModal()">
                <a class="dropdown-item text-light" href="#">
                  Moje konto
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                  </svg>
                </a>
              </li>
              <li @click="openHelpModal()">
                <a class="dropdown-item text-light" href="#">
                  Pomoc
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-question-octagon" viewBox="0 0 16 16">
                    <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                  </svg>
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-light" href="#" @click="logout()">
                  Wyloguj
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-door-open" viewBox="0 0 16 16">
                    <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                    <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </va-navbar-item>
    </template>
  </va-navbar>
</template>

<script>
import HelpModal from '@/components/ReuseComponents/Modals/HelpModal.vue'
import AccountModal from '@/components/ReuseComponents/Modals/AccountModal.vue'
import { useUserStore } from '@/stores/UserStore';
import { useValuationStore } from '@/stores/ValuationStore';

export default {
  name: 'TopHeader',
  data() {
		return {
      showHelpModal: false,
      showAccountModal: false,
		}
	},
  components: { HelpModal, AccountModal },
  computed: {
    userName () {
      const userStore = useUserStore();
      return userStore.userName;
    },
    userInitials () {
      let nameWords = this.userName.split(' ');
      return nameWords[0].charAt(0) + nameWords[1].charAt(0);
    },
  },
  methods: {
    logout() {
      const userStore = useUserStore();
      userStore.$reset();
      const valuationStore = useValuationStore();
      valuationStore.$reset();
      this.$router.push({ name: 'LoginPage' });
      this.$vaToast.init({ message: 'Wylogowano pomyślnie.', color: 'success', duration: 3000 })
    },
    openHelpModal() {
      this.showHelpModal= true;
    },
    closeHelpModal() {
      this.showHelpModal= false;
    },
    openAccountModal() {
      this.showAccountModal = true;
    },
    closeAccountModal() {
      this.showAccountModal = false;
    },
  }
}
</script>

<style scoped>
#userMenu {
  border-radius: 25px;
  padding: 2px;
  padding-right: 5px;
}

#userMenu:hover {
  background: #4e96e4;
}

.userPanel {
  display: flex;
  align-items: center;
}

.dropdown-menu {
  color: white;
  background: #7ab1eb;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
}

.dropdown-item:hover {
  background: #90beee;
}

#logo {
  width: 170px;
}

.moveUserMenu {
  transform: translate(-20px, 50px) !important;
}
</style>
