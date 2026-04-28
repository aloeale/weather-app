import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HourlyView from '../views/HourlyView.vue'
import ForecastView from '../views/ForecastView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/hourly', component: HourlyView },
    { path: '/forecast', component: ForecastView }
  ]
})

export default router