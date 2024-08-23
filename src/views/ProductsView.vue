<template>
  <!-- loading 圖示(自定義化) -->
  <LoadingOverlay v-model:active="loadingStatus" :is-full-page="true"></LoadingOverlay>
  <div class="container">
    <div class="mt-4">
      <!-- 商品列表 -->
      <table class="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td style="width: 200px">
              <div style="height: 100px; background-size: cover; background-position: center"
                :style="{ backgroundImage: `url(${item.imageUrl})` }">
              </div>
            </td>
            <td>
              {{ item.title }}
            </td>
            <td>
              <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
              <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary" @click="viewDetail(item.id)">
                  查看更多
                </button>
                <button type="button" class="btn btn-outline-danger" @click="addToCart(item.id)"
                  :disabled="loadingIcon === item.id || !item.is_enabled">
                  <i class="fas fa-spinner fa-pulse" v-if="loadingIcon === item.id"></i>
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 分頁元件 -->
      <PaginationComponent :pages="pagination" @emit-pages="renderProducts"></PaginationComponent>
    </div>
  </div>
</template>

<script>
import PaginationComponent from '../components/PaginationComponent.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import productStore from '../stores/productsStore.js'
import { mapActions, mapState } from 'pinia'

export default {
  computed: {
    ...mapState(productStore, ['products', 'pagination', 'loadingStatus', 'loadingIcon'])
  },
  components: { PaginationComponent, LoadingOverlay },
  methods: {
    ...mapActions(productStore, ['renderProducts', 'addToCart']),
    viewDetail (id) { // 查看更多
      const existingProduct = this.products.find(item => item.id === id)
      if (existingProduct) {
        this.$router.push(`products/${id}`)
      }
    }
  },
  mounted () {
    this.renderProducts() // 取得商品資料
  }
}
</script>

<style>
</style>
