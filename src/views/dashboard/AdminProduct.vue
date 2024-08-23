<template>
  <div class="container">
    <LoadingOverlay v-model:active="loadingStatus" :is-full-page="true"></LoadingOverlay>
    <div class="text-end mt-4">
      <!-- 建立新的產品按鈕 -->
      <NewProductBtn @open-new-modal="openModal"></NewProductBtn>
    </div>
    <!-- 產品列表 -->
    <AdminProductTable :products="products" @open-created-modal="openModal"></AdminProductTable>
    <!-- 分頁 -->
    <Pagination :pages="pagination" @emit-pages="renderProducts"></Pagination>
  </div>
    <!-- Modal -->
    <ProductModal ref="productModalComponent" :temp-product="tempProduct" @confirm="confirmProduct"
    @create-img="createImages" @del-img="delImages" @upload-img="upload" @call-upload-api="uploadApi">
    </ProductModal>
    <DelProductModal ref="delProductModalComponent" :temp-product="tempProduct" @del-product="confirmDel"></DelProductModal>
    <!-- Modal -->
</template>

<script>
import NewProductBtn from '@/components/NewProductBtn.vue'
import Pagination from '@/components/PaginationComponent.vue'
import AdminProductTable from '../../components/AdminProductTable.vue'
import ProductModal from '../../components/ProductModal.vue'
import DelProductModal from '../../components/DelProductModal.vue'
import LoadingOverlay from '../../components/LoadingOverlay.vue'
import adminProductsStore from '../../stores/adminProductsStore.js'
import { mapActions, mapState } from 'pinia'
import { watchEffect } from 'vue'

export default {
  computed: {
    ...mapState(adminProductsStore, ['products', 'tempProduct', 'isNew', 'pagination', 'formData', 'loadingStatus'])
  },
  components: { NewProductBtn, Pagination, AdminProductTable, ProductModal, DelProductModal, LoadingOverlay },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions(adminProductsStore, ['renderProducts', 'openModal', 'checkImagesArray', 'confirmProduct',
      'confirmDel', 'createImages', 'delImages', 'upload', 'uploadApi'])
  },
  mounted () {
    this.renderProducts()
    watchEffect(() => {
      if (this.isNew === 'new' || this.isNew === 'edit') {
        adminProductsStore().isNew = '' // 因程式先後順序 當進到這裡時 isNew已可以進行重置 以便重複開啟同一個modal
        this.$refs.productModalComponent.openModal()
        this.$refs.productModalComponent.$refs.fileInput.value = ''
      } else if (this.isNew === 'delete') {
        adminProductsStore().isNew = ''
        this.$refs.delProductModalComponent.delModalShow()
      } else if (this.isNew === 'closeModal') {
        adminProductsStore().isNew = ''
        this.$refs.productModalComponent.closeModal()
        this.$refs.delProductModalComponent.delModalHide()
      }
    })
  }
}
</script>
