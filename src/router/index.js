import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/FrontView.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/HomeView.vue')
      },
      {
        path: 'products',
        component: () => import('../views/ProductsView.vue')
      },
      {
        path: 'products/:id',
        component: () => import('../views/ProductDetail.vue')
      },
      {
        path: 'cart',
        component: () => import('../views/CartView.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/AdminLogin.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/DashboardView.vue'),
    children: [
      {
        path: 'adminProduct',
        component: () => import('../views/dashboard/AdminProduct.vue')
      },
      {
        path: 'adminOrder',
        component: () => import('../views/dashboard/AdminOrder.vue')
      },
      {
        path: 'adminCoupons',
        component: () => import('../views/dashboard/AdminCoupons.vue')
      }
    ]
  },
  // 404 頁面
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/404NotFound.vue')
  },
  // 重新導向
  {
    path: '/cart/:pathMatch(.*)*',
    redirect: {
      name: 'Home'
    }
  },
  {
    path: '/dashboard/:pathMatch(.*)*',
    redirect: {
      name: 'Dashboard'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
  scrollBehavior (to, from, savedPosition) { // 切換到cart頁面的時候 畫面移動到最上面
    if (to.fullPath.match('/cart')) {
      return {
        top: 0
      }
    }
  }
})

export default router
