<template>
  <div id="delOrderModal" ref="delOrderModal" class="modal fade" tabindex="-1"
      aria-labelledby="delOrderModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delOrderModalLabel" class="modal-title">
              <span>刪除訂單</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="tempOrder.order">
            是否刪除<strong class="text-danger">【{{tempOrder.order.id}}】</strong> 訂單 <br> (刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="confirmDel">確認刪除</button>
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
      delModal: ''
    }
  },
  methods: {
    ...mapActions(ordersStore, ['confirmDel']),
    delModalShow () {
      this.delModal.show()
    },
    delModalHide () {
      this.delModal.hide()
    }

  },
  mounted () {
    this.delModal = new Modal(this.$refs.delOrderModal)
  }
}
</script>
