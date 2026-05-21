import { createRouter, createWebHistory } from 'vue-router'
import { storage } from '@/utils/storage'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue'), meta: { title: '登录' } },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue'), meta: { title: '注册' } },
  { path: '/post/:id', name: 'PostDetail', component: () => import('@/views/PostDetail.vue'), meta: { title: '帖子详情' } },
  { path: '/post/new', name: 'PostNew', component: () => import('@/views/PostNew.vue'), meta: { title: '发布新帖', auth: true } },
  { path: '/profile/:id?', name: 'Profile', component: () => import('@/views/Profile.vue'), meta: { title: '个人主页' } },
  { path: '/profile/edit', name: 'ProfileEdit', component: () => import('@/views/ProfileEdit.vue'), meta: { title: '编辑资料', auth: true } },
  { path: '/favorites', name: 'Favorites', component: () => import('@/views/Favorites.vue'), meta: { title: '我的收藏', auth: true } },
  { path: '/search', name: 'Search', component: () => import('@/views/Search.vue'), meta: { title: '搜索' } },
  { path: '/quiz', name: 'Quiz', component: () => import('@/views/Quiz.vue'), meta: { title: '算法' } },
  { path: '/enroll', name: 'Enroll', component: () => import('@/views/Enroll.vue'), meta: { title: '纳新' } },
  { path: '/mine', name: 'Mine', component: () => import('@/views/Mine.vue'), meta: { title: '我的', auth: true } },
  { path: '/password/change', name: 'PasswordChange', component: () => import('@/views/PasswordChange.vue'), meta: { title: '修改密码', auth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Open436`
  }

  const user = storage.get('user')

  if (to.meta.auth && !user) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.name === 'Login' && user) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
