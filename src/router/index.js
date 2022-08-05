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
    component: HomeView,
    meta: { requiresAuth: true, authorize: ['Admin', 'Office', 'Production'] }
  },
  {
    path: '/notAllowed',
    name: 'NotAllowed',
    component: NotAllowed,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/programConstants',
    name: 'ProgramConstants',
    component: ProgramConstants,
    meta: { requiresAuth: true, authorize: ['Admin', 'Office', 'Production'] }
  },
  {
    path: '/userMenegment',
    name: 'UserMenegment',
    component: UserMenegment,
    meta: { requiresAuth: true, authorize: ['Admin'] }
  },
  {
    path: '/ongoingOrders',
    name: 'OngoingOrders',
    component: OngoingOrders,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/orderForm',
    name: 'OrderForm',
    component: OrderForm,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/supplierForm',
    name: 'SupplierForm',
    component: SupplierForm,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/customerForm',
    name: 'CustomerForm',
    component: CustomerForm,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/workerForm',
    name: 'WorkerForm',
    component: WorkerForm,
    meta: { requiresAuth: true, authorize: ['Admin'] }
  },
  {
    path: '/supplierSearch',
    name: 'SupplierSearch',
    component: SupplierSearch,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/supplySearch',
    name: 'SupplySearch',
    component: SupplySearch,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/workerSearch',
    name: 'WorkerSearch',
    component: WorkerSearch,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/representativeSearch',
    name: 'RepresentativeSearch',
    component: RepresentativeSearch,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/customerSearch',
    name: 'CustomerSearch',
    component: CustomerSearch,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/orderSearch',
    name: 'OrderSearch',
    component: OrderSearch,
    meta: { requiresAuth: true, authorize: [] }
  },
  {
    path: '/valuationSearch',
    name: 'ValuationSearch',
    component: ValuationSearch,
    meta: { requiresAuth: true, authorize: [] }
  },
]

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/error',
    name: 'ErrorPage',
    component: ErrorPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/maintenance',
    name: 'MaintenancePage',
    component: MaintenancePage,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'LandingView',
    component: LandingView,
    children: children,
    meta: { requiresAuth: true, authorize: ['Admin', 'Office', 'Production'] }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',
})

router.beforeEach(async (to) => {
  if(to.meta.requiresAuth) {
    const userStore = useUserStore();
    const isAuthenticated = userStore.isUserAuthenticated;
    let isAuthorized = false;

    if(to.meta.authorize.length !== 0) {
      to.meta.authorize.forEach(element => {
        if(userStore.doesUserHasRole(element)) { isAuthorized = true; }
      })
    } else {
      isAuthorized = true;
    }

    if(!isAuthenticated) {
      return { name: 'LoginPage' }
    } else if(!isAuthorized) {
      return { name: 'NotAllowed' }
    }
  }
})

export default router
