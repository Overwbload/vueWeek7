import { defineStore } from 'pinia'
import axios from 'axios'
import dayjs from 'dayjs'
const { VITE_APP_API_URL, VITE_APP_API_NAME } = import.meta.env

export default defineStore('couponStore', {
  state: () => ({
    coupons: [],
    pagination: {},
    loadingStatus: '',
    loadingIcon: '',
    tempCoupon: {},
    status: '',
    currentPage: ''
  }),
  actions: {
    getCoupon (page = 1) {
      this.currentPage = page
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/coupons?page=${page}`
      axios.get(url)
        .then(res => {
          this.loadingStatus = false
          this.coupons = res.data.coupons
          this.pagination = res.data.pagination
        })
        .catch(err => {
          this.loadingStatus = false
          alert(err.message)
        })
    },
    openModal (status, item) {
      this.status = status
      if (status === 'new') {
        this.tempCoupon = {
          is_enabled: 1,
          due_date: dayjs().unix() // 每次打開都是目前日期
        }
      } else {
        this.tempCoupon = { ...item }
      }
    },
    confirmCoupon () {
      const isNewCoupon = !this.tempCoupon.id
      const url = isNewCoupon
        ? `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/coupon`
        : `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/coupon/${this.tempCoupon.id}`
      const httpMethod = isNewCoupon ? 'post' : 'put'

      // 檢查是否有編輯內容
      if (!isNewCoupon) {
        const existingCoupon = this.coupons.find(item => item.id === this.tempCoupon.id)
        if (existingCoupon && JSON.stringify(existingCoupon) === JSON.stringify(this.tempCoupon)) {
          alert('No changes made!!')
          return
        }
      }

      axios[httpMethod](url, { data: this.tempCoupon })
        .then(res => {
          this.getCoupon(this.currentPage)
          this.status = 'closeModal'
          alert(res.data.message)
        })
        .catch(err => {
          alert(err.response.data.message)
        })
    },
    enabled (item) {
      this.loadingIcon = item.id
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/coupon/${item.id}`
      axios.put(url, { data: item })
        .then(res => {
          this.loadingIcon = ''
          this.getCoupon(this.currentPage)
          alert(res.data.message)
        })
        .catch(err => {
          alert(err.response.data.message)
        })
    },
    confirmDel () {
      const delCoupon = this.coupons.find(item => item.id === this.tempCoupon.id)
      if (delCoupon) {
        const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/coupon/${this.tempCoupon.id}`
        axios.delete(url)
          .then(res => {
            this.getCoupon(this.currentPage)
            this.status = 'closeModal'
            alert(res.data.message)
          })
          .catch(err => {
            alert(err.response.data.message)
          })
      }
    }
  }
})
