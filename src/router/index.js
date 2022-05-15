import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddSupplier from '../components/Forms/AddSupplier.vue'
import SupplierSearch from '../components/Searchers/SupplierSearch.vue'
import SupplySearch from '../components/Searchers/SupplySearch.vue'
import WorkerSearch from '../components/Searchers/WorkerSearch.vue'
import RepresentativeSearch from '../components/Searchers/RepresentativeSearch.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
