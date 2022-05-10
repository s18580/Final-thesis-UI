import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddSupplier from '../components/Forms/AddSupplier.vue'
import SupplierSearch from '../components/Searchers/SupplierSearch.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/addSupplier',
    name: 'AddSupplier',
    component: AddSupplier
  },
  {
    path: '/supplierSearch',
    name: 'SupplierSearch',
    component: SupplierSearch
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
