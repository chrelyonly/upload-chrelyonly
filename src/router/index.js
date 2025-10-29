import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/file-upload',
      name: 'file-upload',
      component: ()=> import("@/views/file-upload/file-upload.vue")
    },
    {
      path: '/file-preview',
      name: 'file-preview',
      component: ()=> import("@/views/file-preview/file-preview.vue")
    },
  ]
})

export default router
