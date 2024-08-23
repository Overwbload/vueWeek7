<template>
  <h1 class="text-center">你現在在前台頁面</h1>
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd;">
    <div class="container-fluid">
      <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <RouterLink to="/" class="nav-link">首頁</RouterLink>
          <span class="separator">|</span>
          <RouterLink to="/products" class="nav-link">前台產品列表</RouterLink>
          <span class="separator">|</span>
          <RouterLink to="/cart" class="nav-link  position-relative">前台購物車
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            v-if="cart.carts.length !== 0">{{ cart.carts.length }}</span>
          </RouterLink>
          <span class="separator">|</span>
          <RouterLink to="/dashboard/adminProduct" class="nav-link">後台管理</RouterLink>
        </div>
      </div>
    </div>
  </nav>
  <RouterView></RouterView>
</template>

<script>
import cartStore from '../stores/cartStore'
import { mapState } from 'pinia'

export default {
  computed: {
    ...mapState(cartStore, ['cart'])
  },
  mounted () {
    cartStore().getCartList()
  }
}
</script>

<style lang="scss">
</style>
