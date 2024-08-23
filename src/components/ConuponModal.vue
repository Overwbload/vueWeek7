<template>
  <div id="couponModal" ref="couponModal" class="modal fade" tabindex="-1" aria-labelledby="couponModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-md">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 id="couponModalLabel" class="modal-title">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="">
                <div class="mb-3">
                  <label for="title" class="form-label">標題</label>
                  <input id="title" type="text" class="form-control" placeholder="請輸入標題"
                  v-model="tempCoupon.title">
                </div>
                <div class="mb-3">
                  <label for="code" class="form-label">優惠碼</label>
                  <input id="code" type="text" class="form-control" placeholder="請輸入優惠碼"
                  v-model="tempCoupon.code">
                </div>
                <div class="mb-3">
                  <label for="due_date" class="form-label">到期日</label>
                  <input id="due_date" type="date" class="form-control" placeholder="請輸入折扣百分比"
                  v-model="temp_due_date">
                </div>
                <div class="mb-3">
                  <label for="percent" class="form-label">折扣百分比</label>
                  <div class="input-group">
                    <input id="percent" type="number" class="form-control" placeholder="請輸入折扣百分比 ex: 90"
                    min="0" v-model="tempCoupon.percent">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input id="is_enabled" class="form-check-input" type="checkbox" :true-value="1" :false-value="0"
                    v-model="tempCoupon.is_enabled">
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="confirmCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
import couponsStore from '../stores/couponsStore.js'
import { mapActions, mapState } from 'pinia'
// import dayjs from 'dayjs'

export default {
  computed: {
    ...mapState(couponsStore, ['tempCoupon']),
    temp_due_date: {
      get () {
        return this.tempCoupon.due_date
          ? this.$dayjs.unix(this.tempCoupon.due_date).format('YYYY-MM-DD')
          : this.$dayjs().format('YYYY-MM-DD')
      },
      set (val) {
        this.tempCoupon.due_date = this.$dayjs(val).unix()
      }
    }
  },
  data () {
    return {
      bsModal: '',
      loadingIcon: ''
    }
  },
  methods: {
    ...mapActions(couponsStore, ['confirmCoupon']),
    openModal () {
      this.bsModal.show()
    },
    closeModal () {
      this.bsModal.hide()
    }
  },
  mounted () {
    this.bsModal = new Modal(this.$refs.couponModal)
  }
}
</script>
