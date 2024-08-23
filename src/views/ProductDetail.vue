<template>
  <LoadingOverlay v-model:active="loadingStatus" :is-full-page="true"></LoadingOverlay>
  <div class="container mt-4">
    <div class="bg-dark text-white">
      <h5 class="p-3">{{ product.title }}</h5>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <img class="img-fluid mb-2" :src="product.imageUrl" alt="">
        <span v-for="(item, index) in product.imagesUrl" :key="index">
          <img class="img-fluid" :src="item">
        </span>
      </div>
      <div class="col-sm-6 ">
        <span class="badge bg-primary rounded-pill my-2">{{ product.category }}</span>
        <h5 class="my-2">商品描述：{{ product.description }}</h5>
        <h5>商品內容：{{ product.content }}</h5>
        <div class="h5" v-if="!product.price">{{ }} 元</div>
        <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
        <div class="h5" v-if="product.price">現在只要 {{ product.price }} 元</div>
        <div>
          <div class="input-group">
            <input type="number" class="form-control" min="1" v-model.number="qty" @input="validateQty">
            <button type="button" class="btn btn-primary" @click="addToCart(product.id, qty)"
            :disabled="loadingIcon === product.id">
            <i class="fas fa-spinner fa-pulse" v-if="loadingIcon === product.id"></i>
            加入購物車
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingOverlay from '../components/LoadingOverlay.vue'
import productStore from '../stores/productsStore.js'
import { watchEffect } from 'vue'
import { mapActions, mapState } from 'pinia'

export default {
  data () {
    return {
    }
  },
  computed: {
    qty: {
      get () {
        return productStore().qty
      },
      set (newQty) {
        productStore().qty = newQty
      }
    },
    ...mapState(productStore, ['product', 'loadingStatus', 'loadingIcon', 'pageBack'])
  },
  components: { LoadingOverlay },
  methods: {
    ...mapActions(productStore, ['getDetail', 'addToCart', 'validateQty'])
  },
  mounted () {
    this.getDetail(this.$route.params.id)
    watchEffect(() => {
      if (this.pageBack) {
        this.$router.go(-1)
      }
    })
  }
}
</script>
