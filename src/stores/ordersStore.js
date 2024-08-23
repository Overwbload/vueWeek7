import { defineStore } from 'pinia'
import axios from 'axios'
import dayjs from 'dayjs'
const { VITE_APP_API_URL, VITE_APP_API_NAME } = import.meta.env

export default defineStore('orderStore', {
  state: () => ({
    orders: [],
    pagination: {},
    loadingStatus: '',
    tempOrder: {},
    status: '',
    currentPage: ''
  }),
  actions: {
    getOrder (page = 1) {
      this.currentPage = page
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/orders?page=${page}`
      axios.get(url)
        .then(res => {
          this.loadingStatus = false
          this.orders = res.data.orders
          this.pagination = res.data.pagination
        })
        .catch(err => {
          alert(err.message)
        })
    },
    openModal (status, item) {
      this.status = status
      if (status === 'edit') {
        this.tempOrder = JSON.parse(JSON.stringify(item))
      } else if (status === 'delete') { // 開啟刪除產品modal
        this.tempOrder = JSON.parse(JSON.stringify(item))
      }
    },
    paid (item) {
      this.tempOrder.order.is_paid = true
    },
    confirmOrder () {
      const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/order/${this.tempOrder.order.id}`
      axios.put(url, { data: this.tempOrder.order })
        .then(res => {
          this.getOrder(this.currentPage)
          this.status = 'closeModal'
          alert(res.data.message)
        })
        .catch(err => {
          alert(err.response.data.message)
        })
    },
    confirmDel () {
      const delOrder = this.orders.find(item => item.id === this.tempOrder.order.id)
      if (delOrder) {
        const url = `${VITE_APP_API_URL}/api/${VITE_APP_API_NAME}/admin/order/${this.tempOrder.order.id}`
        axios.delete(url)
          .then(res => {
            this.getOrder(this.currentPage)
            this.status = 'closeModal'
            alert(res.data.message)
          })
          .catch(err => {
            console.dir(err)
          })
      }
    }
  },
  getters: {
    orderList: ({ orders }) => {
      const newOrders = orders.map((order) => {
        const time = dayjs.unix(order.create_at).format('YYYY/MM/DD HH:mm:ss')
        return {
          order,
          time
        }
      })
      return {
        newOrders
      }
    }
  }
})
