<template>
  <div id="orderModal" ref="orderModal" class="modal fade" tabindex="-1" aria-labelledby="orderModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 id="orderModalLabel" class="modal-title">
              <span>編輯訂單</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="tempOrder.order">
            <div class="row">
              <div class="col-sm-6">
                <div class="mb-2">
                  <label class="form-label">訂單編號：</label>
                  <span>{{ tempOrder.order.id }}</span>
                </div>
                <div class="mb-2">
                  <label class="form-label">建立時間：</label>
                  <span>{{ tempOrder.time }}</span>
                </div>
                <div class="mb-2">
                  <label class="form-label">總金額：</label>
                  <span>{{$filters.currency(tempOrder.order.total)}}</span>
                </div>
                <div class="mb-2">
                  <label class="form-label">付款狀態：</label>
                  <button type="button" class="btn btn-outline-danger me-2" :disabled="!tempOrder.order.is_paid">未付款</button>
                  <button type="button" class="btn btn-outline-success" :disabled="tempOrder.order.is_paid" @click="paid(tempOrder.order)">已付款</button>
                  <span class="text-success" v-if="tempOrder.order.is_paid"> - 2024/08/20 18:33:09</span>
                </div>
                <hr>
                <div class="userInfo">
                  <div class="mb-2">
                    <label class="form-label">姓名：</label>
                    <span>{{tempOrder.order.user.name}}</span>
                  </div>
                  <div class="mb-2">
                    <label class="form-label">電話：</label>
                    <span>{{tempOrder.order.user.tel}}</span>
                  </div>
                  <div class="mb-2">
                    <label class="form-label">E-mail：</label>
                    <span>{{tempOrder.order.user.email}}</span>
                  </div>
                  <div class="mb-2">
                    <label class="form-label">地址：</label>
                    <span>{{tempOrder.order.user.address}}</span>
                  </div>
                  <div class="mb-2">
                    <label class="form-label">留言：</label>
                    <span>{{tempOrder.order.message}}</span>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <table class="table">
                  <thead>
                    <tr><h5>購買項目</h5></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(product, key) in tempOrder.order.products" :key="key">
                      <th>
                        {{ product.product.title }}
                      </th>
                      <td>{{ product.qty }} / {{ product.product.unit }}</td>
                      <td class="text-end">
                        {{ $filters.currency(product.final_total) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr>
                <div class="mb-3">
                  <label for="description" class="form-label">備註</label>
                  <textarea id="description" type="text" class="form-control" placeholder="請輸入備註內容"
                  v-model="tempOrder.order.note"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="confirmOrder">確認</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
import ordersStore from '../stores/ordersStore.js'
import { mapActions, mapState } from 'pinia'

export default {
  computed: {
    ...mapState(ordersStore, ['tempOrder'])
  },
  data () {
    return {
      bsModal: '',
      loadingIcon: ''
    }
  },
  methods: {
    ...mapActions(ordersStore, ['paid']),
    confirmOrder () {
      this.$emit('confirm')
    },
    openModal () {
      this.bsModal.show()
    },
    closeModal () {
      this.bsModal.hide()
    }
  },
  mounted () {
    this.bsModal = new Modal(this.$refs.orderModal)
  }
}
</script>
