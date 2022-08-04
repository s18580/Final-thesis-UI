import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../components/LandingView.vue';
import LoginPage from '../components/AuthComponents/LoginPage.vue';
import ErrorPage from '../components/TechnicalPages/ErrorPage.vue';
import MaintenancePage from '../components/TechnicalPages/MaintenancePage.vue';
import NotAllowed from '../components/TechnicalPages/NotAllowed.vue';
import HomeView from '../views/HomeView.vue';
import ProgramConstants from '../components/ProgramConstants.vue';
import UserMenegment from '../components/UserMenegment.vue';
import OngoingOrders from '../components/OngoingOrders.vue';
import SupplierForm from '../components/Forms/SupplierForm.vue';
import OrderForm from '../components/Forms/OrderForm.vue';
import CustomerForm from '../components/Forms/CustomerForm.vue';
import WorkerForm from '../components/Forms/WorkerForm.vue';
import SupplierSearch from '../components/Searchers/SupplierSearch.vue';
import SupplySearch from '../components/Searchers/SupplySearch.vue';
import WorkerSearch from '../components/Searchers/WorkerSearch.vue';
import RepresentativeSearch from '../components/Searchers/RepresentativeSearch.vue';
import CustomerSearch from '../components/Searchers/CustomerSearch.vue';
import OrderSearch from '../components/Searchers/OrderSearch.vue';
import ValuationSearch from '../components/Searchers/ValuationSearch.vue';

import { useUserStore } from '@/stores/UserStore';

const children = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/notAllowed',
    name: 'NotAllowed',
    component: NotAllowed
  },
  {
    path: '/programConstants',
    name: 'ProgramConstants',
    component: ProgramConstants
  },
  {
    path: '/userMenegment',
    name: 'UserMenegment',
    component: UserMenegment
  },
  {
    path: '/ongoingOrders',
    name: 'OngoingOrders',
    component: OngoingOrders
  },
  {
    path: '/orderForm',
    name: 'OrderForm',
    component: OrderForm
  },
  {
    path: '/supplierForm',
    name: 'SupplierForm',
    component: SupplierForm
  },
  {
    path: '/customerForm',
    name: 'CustomerForm',
    component: CustomerForm
  },
  {
    path: '/workerForm',
    name: 'WorkerForm',
    component: WorkerForm
  },
  {
    path: '/supplierSearch',
    name: 'SupplierSearch',
    component: SupplierSearch
  },
  {
    path: '/supplySearch',
    name: 'SupplySearch',
    component: SupplySearch
  },
  {
    path: '/workerSearch',
    name: 'WorkerSearch',
    component: WorkerSearch
  },
  {
    path: '/representativeSearch',
    name: 'RepresentativeSearch',
    component: RepresentativeSearch
  },
  {
    path: '/customerSearch',
    name: 'CustomerSearch',
    component: CustomerSearch
  },
  {
    path: '/orderSearch',
    name: 'OrderSearch',
    component: OrderSearch
  },
  {
    path: '/valuationSearch',
    name: 'ValuationSearch',
    component: ValuationSearch
  },
]

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/error',
    name: 'ErrorPage',
    component: ErrorPage
  },
  {
    path: '/maintenance',
    name: 'MaintenancePage',
    component: MaintenancePage
  },
  {
    path: '/',
    name: 'LandingView',
    component: LandingView,
    children: children
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',
})

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isUserAuthenticated;
  const isAuthorized = true; // add some function to check it

  if(to.name != "LoginPage"){
    if(!isAuthenticated) {
      return { name: 'LoginPage' }
    } else if(!isAuthorized) {
      return { name: 'NotAllowed' }
    }
  }
})

export default router
