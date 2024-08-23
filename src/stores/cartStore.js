import { defineStore } from 'pinia'
import axios from 'axios'
const { VITE_APP_API_URL, VITE_APP_API_NAME } = import.meta.env

export default defineStore('cart', {
  state: () => ({
    cart: {
      carts: []
    },
    comparisonCart: { // 用來比對用的購物車物件
      carts: []
    },
    loadingStatus: '',
    loadingIcon: '',
    form: {
      user: { // 顧客
        email: '',
        name: '',
        tel: '',
        address: ''
      },
      message: ''
    },
    resetUserForm: '',
    coupon_code: ''
  }),
  actions: {
    getCartList () { // 取得購物車清單
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/cart`
      axios.get(url)
        .then(res => {
          this.cart = res.data.data
          this.comparisonCart = JSON.parse(JSON.stringify(res.data.data)) // 深拷貝同樣的資料以方便updateQty時進行比對
          this.loadingStatus = false
        })
        .catch(err => {
          alert(err.response.data.message)
        })
    },
    updateQty (item) { // 更改購買數量
      const existingProduct = this.comparisonCart.carts.find(cart => cart.product_id === item.product_id)
      if (existingProduct && existingProduct.qty !== item.qty) { // 當函式觸發如果產品存在且數量不為原數量
        this.loadingIcon = item.id
        if (item.qty <= 0) {
          alert('數量必須大於0')
          item.qty = 1
        }
        const tempCart = {
          product_id: item.product_id,
          qty: item.qty
        }
        const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/cart/${item.id}`
        axios.put(url, { data: tempCart })
          .then(res => {
            this.loadingIcon = ''
            alert(res.data.message)
            this.getCartList()
          })
          .catch(err => {
            alert(err.response.data.message)
          })
      }
    },
    delProduct (id) { // 刪除單一商品
      this.loadingIcon = id
      const existingProduct = this.cart.carts.find(item => item.id === id)
      if (existingProduct) {
        const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/cart/${id}`
        axios.delete(url)
          .then(res => {
            alert(res.data.message)
            this.getCartList()
            this.loadingIcon = ''
          })
          .catch(err => {
            alert(err.response.data.message)
          })
      }
    },
    delAll () { // 刪除購物車內全部商品
      this.loadingStatus = true
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/carts`
      axios.delete(url)
        .then(res => {
          alert(res.data.message)
          this.getCartList()
          this.loadingStatus = false
        })
        .catch(err => {
          alert(err.response.data.message)
          this.loadingStatus = false
        })
    },
    sendOrder () { // 送出訂單
      this.resetUserForm = false
      const Order = this.form
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/order`
      axios.post(url, { data: Order })
        .then(res => {
          this.resetUserForm = true
          this.getCartList()
          alert(res.data.message)
        })
        .catch(err => {
          this.resetUserForm = true
          alert(err.response.data.message)
        })
    },
    addCouponCode () {
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/coupon`
      const coupon = {
        code: this.coupon_code
      }
      axios.post(url, { data: coupon })
        .then(res => {
          console.log(res)
          this.getCartList()
          alert(res.data.message)
        })
        .catch(err => {
          alert(err.response.data.message)
        })
    }
  }
})
