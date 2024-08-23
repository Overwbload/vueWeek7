<template>
  <div class="container">
    <LoadingOverlay v-model:active="loadingStatus" :is-full-page="true"></LoadingOverlay>
    <!-- 購物車列表 -->
    <div v-if="cart.carts.length === 0" class="alert alert-secondary text-center m-5">購物車是空的</div>
    <div v-else>
      <div class="text-end mt-2">
        <button class="btn btn-outline-danger" type="button" @click="delAll"
          :disabled="loadingIcon !== '' || cart.carts.length === 0">清空購物車
          <span class="badge rounded-pill bg-primary">{{ cart.carts.length }}</span>
        </button>
      </div>
      <table class="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th class="text-center" style="width: 150px">數量/單位</th>
            <th class="text-end">單價</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="cart.carts">
            <tr v-for="item in cart.carts" :key="item.id">
              <td>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="delProduct(item.id)"
                  :disabled="loadingIcon === item.id">
                  <i class="fas fa-spinner fa-pulse" v-if="loadingIcon === item.id"></i>
                  x
                </button>
              </td>
              <td>
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group mb-3">
                    <input min="1" type="number" class="form-control" v-model.number="item.qty"
                      :disabled="loadingIcon === item.id" @blur="updateQty(item)">
                    <span class="input-group-text" id="basic-addon2">{{ item.product.unit }}</span>
                  </div>
                </div>
              </td>
              <td class="text-end">
                <small class="text-success" v-if="item.coupon">折扣價：</small>
                {{ $filters.currency(item.final_total) }}
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-end">總計</td>
            <td class="text-end">{{ $filters.currency(cart.total) }}</td>
          </tr>
          <tr v-if="cart.total !== cart.final_total">
            <td colspan="3" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">{{ $filters.currency(cart.final_total) }}</td>
          </tr>
        </tfoot>
      </table>
      <div class="input-group mb-3 input-group-sm" style="width: 500px;">
        <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼" />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary ms-2" type="button" @click="addCouponCode">
            套用優惠碼
          </button>
        </div>
      </div>
    </div>
    <!-- 使用者表單 -->
    <div class="my-5 row justify-content-center">
      <v-form ref="form" class="col-md-6" v-slot="{ errors }" @submit="sendOrder">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <v-field id="email" name="email" type="email" class="form-control" :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email" rules="required|email" v-model="form.user.email"></v-field>
          <error-message name="email" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <v-field id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名" rules="required"  v-model="form.user.name"></v-field>
          <error-message name="姓名" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <v-field id="tel" name="電話" type="tel" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
            placeholder="請輸入電話" rules="required|regex:^(09)[0-9]{8}$" v-model="form.user.tel"></v-field>
          <error-message name="電話" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <v-field id="address" name="地址" type="text" class="form-control" :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入地址" rules="required" v-model="form.user.address"></v-field>
          <error-message name="地址" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <v-field name="留言" as="textarea" id="message" class="form-control" cols="30" rows="10" rules=""
          :class="{ 'is-invalid': errors['留言'] }" v-model="form.message">
          </v-field>
          <error-message name="留言" class="invalid-feedback"></error-message>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-danger">送出訂單</button>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import LoadingOverlay from '../components/LoadingOverlay.vue'
import cartStore from '../stores/cartStore'
import { mapActions, mapState } from 'pinia'

export default {
  computed: {
    ...mapState(cartStore, ['cart', 'loadingStatus', 'loadingIcon', 'form', 'resetUserForm']),
    coupon_code: {
      get () {
        return ''
      },
      set (val) {
        cartStore().coupon_code = val
      }
    }
  },
  components: { LoadingOverlay },
  methods: {
    ...mapActions(cartStore, ['getCartList', 'updateQty', 'delProduct', 'delAll', 'sendOrder', 'addCouponCode'])
  },
  mounted () {
    this.getCartList() // 取得購物車資料
  },
  watch: {
    resetUserForm () {
      this.$refs.form.resetForm()
    }
  }
}
</script>
