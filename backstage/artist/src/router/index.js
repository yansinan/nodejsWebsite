import Vue from 'vue'
import Router from 'vue-router'
import settings from "@root/publicMethods/settings";
import Artist from '@/views/artist'

Vue.use(Router)

const createRouter = () => new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [{
    path: settings.admin_base_path + '/artist',
    name: 'artist',
    component: Artist
  }, {
    path: settings.admin_base_path + '/artist/addArtist',
    name: 'addArtist',
    component: () => import( /* webpackChunkName: "addArtist" */ '@/views/artist/contentForm.vue')
  }, {
    path: settings.admin_base_path + '/artist/edit_artist/:id',
    name: 'editArtist',
    component: () => import( /* webpackChunkName: "editArtist" */ '@/views/artist/contentForm.vue')
  }]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router