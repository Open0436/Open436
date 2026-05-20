import { createRouter, createWebHistory } from 'vue-router'
import { storage } from '@/utils/storage'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: '登录', guest: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/UserView.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'quiz',
        name: 'Quiz',
        component: () => import('@/views/quiz/QuizView.vue'),
        meta: { title: '习题管理', icon: 'EditPen' }
      },
      {
        path: 'forum',
        name: 'Forum',
        component: () => import('@/views/forum/ForumView.vue'),
        meta: { title: '论坛管理', icon: 'ChatDotRound' }
      },
      {
        path: 'enrollment',
        name: 'Enrollment',
        component: () => import('@/views/enrollment/EnrollmentView.vue'),
        meta: { title: '纳新管理', icon: 'UserFilled' }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = storage.get('token')
  const user = storage.get('user')

  if (to.meta.title) {
    document.title = `${to.meta.title} - Open436 Admin`
  }

  if (to.meta.guest) {
    if (token && user) return next('/dashboard')
    return next()
  }

  if (!token || !user) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (user.role !== 'admin') {
    storage.clear()
    return next('/login')
  }

  next()
})

export default router
