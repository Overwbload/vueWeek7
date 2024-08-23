<template>
  <div class="container">
    <LoadingOverlay v-model:active="loadingStatus" :is-full-page="true"></LoadingOverlay>
    <h2 class="ms-1 mt-2">訂單列表</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>購買時間</th>
          <th>購買項目</th>
          <th>應付金額</th>
          <th>付款狀態</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="newOrders in orderList.newOrders" :key="newOrders.order.id">
          <!-- 訂單編號 -->
          <td style="width: 250px;">{{newOrders.order.id}}</td>
          <!-- 購買時間 -->
          <td style="width: 250px;">{{ newOrders.time }}</td>
          <!-- 購買項目 -->
          <td>
            <ul>
              <li v-for="(product, key) in newOrders.order.products" :key="key">
                {{ product.product.title }}  〔{{ product.qty }}〕
              </li>
            </ul>
          </td>
          <!-- 應付金額 -->
          <td>$ {{ $filters.currency(newOrders.order.total)}}</td>
          <!-- 付款狀態 -->
          <td>
            <span class="text-success" v-if="newOrders.order.is_paid">已付款</span>
            <span class="text-danger" v-else>未付款</span>
          </td>
          <!-- 編輯 -->
          <td>
            <div class="btn-group">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal('edit', newOrders)">編輯</button>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete',newOrders)">刪除</button>
              </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁元件 -->
    <PaginationComponent nationComponent :pages="pagination" @emit-pages="getOrder"></PaginationComponent>
    <!-- Modal -->
    <OrderModal  ref="orderModalComponent"  @confirm="confirmOrder"></OrderModal>
    <DelOrderModal ref="delOrderModal"></DelOrderModal>
  </div>
</template>

<script>
import LoadingOverlay from '../../components/LoadingOverlay.vue'
import PaginationComponent from '../../components/PaginationComponent.vue'
import ordersStore from '../../stores/ordersStore'
import OrderModal from '../../components/OrderModal.vue'
import DelOrderModal from '../../components/DelOrderModal.vue'
import { mapActions, mapState } from 'pinia'
import { watchEffect } from 'vue'

export default {
  computed: {
    ...mapState(ordersStore, ['pagination', 'orderList', 'loadingStatus', 'status', 'orders'])
  },
  components: { PaginationComponent, LoadingOverlay, OrderModal, DelOrderModal },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions(ordersStore, ['getOrder', 'openModal', 'confirmOrder'])
  },
  mounted () {
    this.getOrder()
    watchEffect(() => {
      if (this.status === 'edit') {
        ordersStore().status = ''
        this.$refs.orderModalComponent.openModal()
      } else if (this.status === 'delete') {
        ordersStore().status = ''
        this.$refs.delOrderModal.delModalShow()
      } else if (this.status === 'closeModal') {
        ordersStore().status = ''
        this.$refs.orderModalComponent.closeModal()
        this.$refs.delOrderModal.delModalHide()
      }
    })
  }
}
</script>
