import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './components/LoginPage.vue'
import RegistrationPage from './components/RegistrationPage.vue'
import DailyUpdateForm from './components/DailyUpdateForm.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegistrationPage },
  {
    path: '/daily-update',
    component: DailyUpdateForm,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (to.meta.requiresAuth && !user) {
    next({ path: '/' }) // Redirect to login if not logged in
  } else {
    next()
  }
})

export default router