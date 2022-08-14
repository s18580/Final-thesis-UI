import { createRouter, createWebHistory } from 'vue-router';
import AdminHome from '@/components/HomePages/AdminHome.vue';
import BasicHome from '@/components/HomePages/BasicHome.vue';
import AccountantHome from '@/components/HomePages/AccountantHome.vue';
import LandingView from '@/components/LandingView.vue';
import LoginPage from '@/components/AuthComponents/LoginPage.vue';
import ErrorPage from '@/components/TechnicalPages/ErrorPage.vue';
import MaintenancePage from '@/components/TechnicalPages/MaintenancePage.vue';
import NotAllowed from '@/components/TechnicalPages/NotAllowed.vue';
import ProgramConstants from '@/components/ProgramConstants.vue';
import UserMenegment from '@/components/UserMenegment.vue';
import OngoingOrders from '@/components/OngoingOrders.vue';
import SupplierForm from '@/components/Forms/SupplierForm.vue';
import OrderForm from '@/components/Forms/OrderForm.vue';
import CustomerForm from '@/components/Forms/CustomerForm.vue';
import WorkerForm from '@/components/Forms/WorkerForm.vue';
import SupplierSearch from '@/components/Searchers/SupplierSearch.vue';
import SupplySearch from '@/components/Searchers/SupplySearch.vue';
import WorkerSearch from '@/components/Searchers/WorkerSearch.vue';
import RepresentativeSearch from '@/components/Searchers/RepresentativeSearch.vue';
import CustomerSearch from '@/components/Searchers/CustomerSearch.vue';
import OrderSearch from '@/components/Searchers/OrderSearch.vue';
import ValuationSearch from '@/components/Searchers/ValuationSearch.vue';

import { useUserStore } from '@/stores/UserStore';

const children = [
  {
    path: '/',
    name: 'home',
    meta: { requiresAuth: true, authorize: ['Basic'] },
    beforeEnter: () => {
      const userStore = useUserStore();
      let userRoles = userStore.userRoles;
      
      if(userRoles.includes('Admin')) {
        return { name: 'AdminHome' }
      } else if(userRoles.includes('Accountant')) {
        return { name: 'AccountantHome' }
      }
      return { name: 'BasicHome' }
    },
  },
  {
    path: '/',
    name: 'AccountantHome',
    component: AccountantHome,
    meta: { requiresAuth: true, authorize: ['Accountant'] },
  },
  {
    path: '/',
    name: 'BasicHome',
    component: BasicHome,
    meta: { requiresAuth: true, authorize: ['Basic'] },
  },
  {
    path: '/',
    name: 'AdminHome',
    component: AdminHome,
    meta: { requiresAuth: true, authorize: ['Admin'] },
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
    meta: { requiresAuth: true, authorize: ['Admin'] }
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
    meta: { requiresAuth: true, authorize: ['Basic'] }
  },
  {
    path: '/orderForm',
    name: 'OrderForm',
    component: OrderForm,
    meta: { requiresAuth: true, authorize: ['Basic'] }
  },
  {
    path: '/supplierForm',
    name: 'SupplierForm',
    component: SupplierForm,
    meta: { requiresAuth: true, authorize: ['Basic'] }
  },
  {
    path: '/customerForm',
    name: 'CustomerForm',
    component: CustomerForm,
    meta: { requiresAuth: true, authorize: ['Basic'] }
  },
  {
    path: '/workerForm:id?',
    name: 'WorkerForm',
    component: WorkerForm,
    meta: { requiresAuth: true, authorize: ['Admin'] },
    props: true,
  },
  {
    path: '/supplierSearch',
    name: 'SupplierSearch',
    component: SupplierSearch,
    meta: { requiresAuth: true, authorize: ['Basic'] }
  },
  {
    path: '/supplySearch',
    name: 'SupplySearch',
    component: SupplySearch,
    meta: { requiresAuth: true, authorize: ['Basic'] }
  },
  {
    path: '/workerSearch',
    name: 'WorkerSearch',
    component: WorkerSearch,
    meta: { requiresAuth: true, authorize: ['Accountant'] }
  },
  {
    path: '/representativeSearch',
    name: 'RepresentativeSearch',
    component: RepresentativeSearch,
    meta: { requiresAuth: true, authorize: ['Basic'] }
  },
  {
    path: '/customerSearch',
    name: 'CustomerSearch',
    component: CustomerSearch,
    meta: { requiresAuth: true, authorize: ['Basic'] }
  },
  {
    path: '/orderSearch',
    name: 'OrderSearch',
    component: OrderSearch,
    meta: { requiresAuth: true, authorize: ['Basic'] }
  },
  {
    path: '/valuationSearch',
    name: 'ValuationSearch',
    component: ValuationSearch,
    meta: { requiresAuth: true, authorize: ['Office'] }
  },
]

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: { requiresAuth: false, authorize: [] }
  },
  {
    path: '/error',
    name: 'ErrorPage',
    component: ErrorPage,
    meta: { requiresAuth: false, authorize: [] }
  },
  {
    path: '/maintenance',
    name: 'MaintenancePage',
    component: MaintenancePage,
    meta: { requiresAuth: false, authorize: [] }
  },
  {
    path: '/',
    name: 'LandingView',
    component: LandingView,
    children: children,
    meta: { requiresAuth: true, authorize: ['Basic'] }
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
