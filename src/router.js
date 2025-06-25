import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './components/LoginPage.vue'
import RegistrationPage from './components/RegistrationPage.vue'
import DailyUpdateForm from './components/DailyUpdateForm.vue'
import ProfilePage from './components/ProfilePage.vue'
import ProfileEditPage from './components/ProfileEditPage.vue'
import HistoryPage from './components/HistoryPage.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegistrationPage },
  {
    path: '/daily-update',
    component: DailyUpdateForm,
    meta: { requiresAuth: true }
  },
  { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/profile-edit', component: ProfileEditPage, meta: { requiresAuth: true } },
  { path: '/history', component: HistoryPage, meta: { requiresAuth: true } },
  {
    path: '/thank-you',
    name: 'ThankYou',
    component: () => import('./components/ThankYou.vue')
  },
  {
  path: '/edit-update/:index',
  name: 'EditUpdate',
  component: () => import('./components/EditUpdateForm.vue'),
  props: true
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