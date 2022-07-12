<template>
  <div id="navigationMenu">
    <ul>
      <li class="nav-menu-item">
        <router-link :to="{ name: 'home'}">
          <div class="px-2 py-3 item-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/>
            </svg>
            Strona główna
          </div>
        </router-link>
      </li>
      <li class="nav-menu-item">
        <div class="px-2 py-3 item-content nonclicable item-content2" data-bs-toggle="collapse" data-bs-target="#collapseAccountsMenegment" role="button" aria-expanded="false" aria-controls="collapseExample">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
            </svg>
            Zarządzanie kontami
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
          </svg>
        </div>
        <div class="collapse" id="collapseAccountsMenegment">
          <router-link :to="{ name: 'MaintenancePage'}">
          <div class="px-2 py-3 item-content inner">
            Zarządzaj kontami
          </div>
          </router-link>
          <router-link :to="{ name: 'WorkerForm'}">
          <div class="px-2 py-3 item-content inner">
            Dodaj konto
          </div>
          </router-link>
        </div>
      </li>
      <li class="nav-menu-item">
        <router-link :to="{ name: 'ProgramConstants'}">
          <div class="px-2 py-3 item-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-motherboard-fill" viewBox="0 0 16 16">
              <path d="M5 7h3V4H5v3Z"/>
              <path d="M1 2a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 9H1V8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6H1V5H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 2H1Zm11 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7Zm2 0a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7ZM3.5 10a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6Zm0 2a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6ZM4 4h-.5a.5.5 0 0 0 0 1H4v1h-.5a.5.5 0 0 0 0 1H4a1 1 0 0 0 1 1v.5a.5.5 0 0 0 1 0V8h1v.5a.5.5 0 0 0 1 0V8a1 1 0 0 0 1-1h.5a.5.5 0 0 0 0-1H9V5h.5a.5.5 0 0 0 0-1H9a1 1 0 0 0-1-1v-.5a.5.5 0 0 0-1 0V3H6v-.5a.5.5 0 0 0-1 0V3a1 1 0 0 0-1 1Zm7 7.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5Z"/>
            </svg>
            Stałe programowe
          </div>
        </router-link>
      </li>
      <li class="nav-menu-item">
        <router-link :to="{ name: 'home'}">
          <div class="px-2 py-3 item-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cloud-download-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/>
            </svg>
            Kopie zapasowe
          </div>
        </router-link>
      </li>
      <li class="nav-menu-item">
          <div class="px-2 py-3 item-content nonclicable item-content2"  data-bs-toggle="collapse" data-bs-target="#collapseOrders" role="button" aria-expanded="false" aria-controls="collapseExample">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-clipboard2-check" viewBox="0 0 16 16">
                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"/>
                <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"/>
                <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z"/>
              </svg>
              Zamówienia
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
            </svg>
          </div>
          <div class="collapse" id="collapseOrders">
          <router-link :to="{ name: 'OrderForm'}">
          <div class="px-2 py-3 item-content inner">
            Dodaj zamówienie
          </div>
          </router-link>
          <router-link :to="{ name: 'OrderSearch'}">
          <div class="px-2 py-3 item-content inner">
            Wyszukaj zamówienie
          </div>
          </router-link>
          <router-link :to="{ name: 'OngoingOrders'}">
          <div class="px-2 py-3 item-content inner">
            W trakcie realizacji
          </div>
          </router-link>
          <router-link :to="{ name: 'home'}">
          <div class="px-2 py-3 item-content inner">
            Kolejka produkcyjna
          </div>
          </router-link>
        </div>
      </li>
      <li class="nav-menu-item">
        <div class="px-2 py-3 item-content nonclicable item-content2" data-bs-toggle="collapse" data-bs-target="#collapseClients" role="button" aria-expanded="false" aria-controls="collapseExample">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
              <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
            Klienci
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
          </svg>
        </div>
        <div class="collapse" id="collapseClients">
          <router-link :to="{ name: 'CustomerForm'}">
          <div class="px-2 py-3 item-content inner">
            Dodaj klienta
          </div>
          </router-link>
          <router-link :to="{ name: 'CustomerSearch'}">
          <div class="px-2 py-3 item-content inner">
            Wyszukaj klienta
          </div>
          </router-link>
        </div>
      </li>
      <li class="nav-menu-item">
        <div class="px-2 py-3 item-content nonclicable item-content2" data-bs-toggle="collapse" data-bs-target="#collapseSuppliers" role="button" aria-expanded="false" aria-controls="collapseExample">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-minecart-loaded" viewBox="0 0 16 16">
              <path d="M4 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM.115 3.18A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 14 12H2a.5.5 0 0 1-.491-.408l-1.5-8a.5.5 0 0 1 .106-.411zm.987.82 1.313 7h11.17l1.313-7H1.102z"/>
              <path fill-rule="evenodd" d="M6 1a2.498 2.498 0 0 1 4 0c.818 0 1.545.394 2 1 .67 0 1.552.57 2 1h-2c-.314 0-.611-.15-.8-.4-.274-.365-.71-.6-1.2-.6-.314 0-.611-.15-.8-.4a1.497 1.497 0 0 0-2.4 0c-.189.25-.486.4-.8.4-.507 0-.955.251-1.228.638-.09.13-.194.25-.308.362H3c.13-.147.401-.432.562-.545a1.63 1.63 0 0 0 .393-.393A2.498 2.498 0 0 1 6 1z"/>
            </svg>
            Dostawcy
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
          </svg>
        </div>
        <div class="collapse" id="collapseSuppliers">
          <router-link :to="{ name: 'SupplierForm'}">
          <div class="px-2 py-3 item-content inner">
            Dodaj dostawcę
          </div>
          </router-link>
          <router-link :to="{ name: 'SupplierSearch'}">
          <div class="px-2 py-3 item-content inner">
            Wyszukaj dostawcę
          </div>
          </router-link>
          <router-link :to="{ name: 'SupplySearch'}">
          <div class="px-2 py-3 item-content inner">
            Wyszukaj dostawę
          </div>
          </router-link>
        </div>
      </li>
      <li class="nav-menu-item">
        <div class="px-2 py-3 item-content nonclicable item-content2" data-bs-toggle="collapse" data-bs-target="#collapseValuation" role="button" aria-expanded="false" aria-controls="collapseExample">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cash-coin" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
              <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z"/>
              <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z"/>
              <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z"/>
            </svg>
            Wyceny
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
          </svg>
        </div>
        <div class="collapse" id="collapseValuation">
          <router-link :to="{ name: 'home'}">
          <div class="px-2 py-3 item-content inner">
            Stwórz wycenę
          </div>
          </router-link>
          <router-link :to="{ name: 'ValuationSearch'}">
          <div class="px-2 py-3 item-content inner">
            Wyszukaj wycenę
          </div>
          </router-link>
        </div>
      </li>
      <li class="nav-menu-item">
        <div class="px-2 py-3 item-content nonclicable item-content2" data-bs-toggle="collapse" data-bs-target="#collapseWorker" role="button" aria-expanded="false" aria-controls="collapseExample">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-person-workspace" viewBox="0 0 16 16">
              <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
              <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z"/>
            </svg>
            Pracownicy
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
          </svg>
        </div>
        <div class="collapse" id="collapseWorker">
          <router-link :to="{ name: 'WorkerSearch'}">
          <div class="px-2 py-3 item-content inner">
            Wyszukaj pracownika
          </div>
          </router-link>
        </div>
      </li>
      <li class="nav-menu-item">
        <div class="px-2 py-3 item-content nonclicable item-content2" data-bs-toggle="collapse" data-bs-target="#collapseStats" role="button" aria-expanded="false" aria-controls="collapseExample">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-graph-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M0 0h1v15h15v1H0V0Zm14.817 11.887a.5.5 0 0 0 .07-.704l-4.5-5.5a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61 4.15 5.073a.5.5 0 0 0 .704.07Z"/>
          </svg>
          Statystyki
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
          </svg>
        </div>
        <div class="collapse" id="collapseStats">
          <router-link :to="{ name: 'home'}">
          <div class="px-2 py-3 item-content inner">
            Statystyki biznesowe
          </div>
          </router-link>
          <router-link :to="{ name: 'home'}">
          <div class="px-2 py-3 item-content inner">
            Statystyki systemowe
          </div>
          </router-link>
        </div>
      </li>
      <li class="nav-menu-item">
        <router-link :to="{ name: 'RepresentativeSearch'}">
          <div class="px-2 py-3 item-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            Szukaj osoby kontaktowej
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  data() {
    return {

    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
#navigationMenu {
  background: #313a46;
  width: 260px;
  bottom: 0;
  position: fixed;
  top: 0;
  padding: 0;
  overflow-y:scroll;
}

ul{
  padding: 0;
  margin: 0;
}

.nav-menu-item {
  list-style-type: none;
  text-align: left;
  margin-left: 15px;
}

.nav-menu-item a {
  color: #8391a2;
  text-decoration: none;
}

.nav-menu-item a:hover{
  color: #bccee4;
}

.nav-menu-item a:active {
  color: #fff;
  text-decoration: none;
}

.item-contentt {
  font-size: .9375rem;
}

.item-content2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

router-link {
  padding: 15px;
}

.nonclicable {
  padding: 15px;
  color: #8391a2;
  text-decoration: none;
  cursor: pointer;
}

.nonclicable:hover {
  color: #bccee4;
}

.nonclicable:active {
  color: #fff;
  text-decoration: none;
}

svg {
  padding-bottom: 5px;
}

#navigationMenu::-webkit-scrollbar {
  width: 0.5rem;
}

#navigationMenu::-webkit-scrollbar-thumb {
  background: #646f7c;
  border-radius: 100vw;
}

#navigationMenu::-webkit-scrollbar-thumb:hover {
  background: #9aaabe;
}

.inner {
  margin-left: 15px;
}

.rotated {
  transform: rotate(90deg)
}

.exact-active-link div{
  color: white;
}

</style>