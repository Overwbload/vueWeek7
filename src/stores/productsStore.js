import { defineStore } from 'pinia'
import axios from 'axios'
import cartStore from './cartStore'
const { VITE_APP_API_URL, VITE_APP_API_NAME } = import.meta.env

export default defineStore('productsStore', {
  state: () => ({
    products: [],
    product: [],
    pagination: {},
    loadingStatus: '',
    loadingIcon: '',
    qty: 1,
    pageBack: false
  }),
  actions: {
    renderProducts (page = 1) { // call API get產品資訊  默認頁碼設為1 當頁碼資料被傳入時page會被改變
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/products?page=${page}`
      axios.get(url)
        .then(res => {
          this.products = res.data.products
          this.pagination = res.data.pagination
          this.loadingStatus = false
        })
        .catch(err => {
          alert(err.response.data.message)
        })
    },
    getDetail (id) {
      this.pageBack = false
      this.product = [] // 會有短暫顯示上一個資料的問題 設置重置
      this.qty = 1
      this.loadingStatus = true
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/product/${id}`
      axios.get(url)
        .then(res => {
          this.product = res.data.product
          this.loadingStatus = false
        })
        .catch(err => {
          alert(err.response.data.message)
          this.loadingStatus = false
          this.pageBack = true
        })
    },
    addToCart (productId, qty = 1) { // 加入購物車
      this.loadingIcon = productId
      const tempCart = {
        product_id: productId,
        qty
      }
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/cart`
      axios.post(url, { data: tempCart })
        .then(res => {
          cartStore().getCartList()
          alert(res.data.message)
          this.loadingIcon = ''
        })
        .catch(err => {
          alert(err.response.data.message)
          // if (err.message === 'Network Error') {
          //   alert('產品不存在，請重新操作')
          //   this.renderProducts()
          // }
        })
    },
    validateQty () {
      if (this.qty < 1) {
        this.qty = 1
      }
    }
  }
})
