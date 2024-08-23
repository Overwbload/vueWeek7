import './assets/all.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { all } from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { date, currency } from '@/methods/filters'
// ---------------
import App from './App.vue'
import router from './router'
// ---------------
const app = createApp(App)
// vee-validate 設定
Object.keys(all).forEach((rule) => { // 定義規則-全部加入
  defineRule(rule, all[rule])
})
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})
setLocale('zh_TW') // 設定預設語系

// 設定全域使用this.$dayjs (但Store中是不能使用這種形式的)
app.config.globalProperties.$dayjs = dayjs
// 擴展時間套件
dayjs.extend(utc)
dayjs.extend(timezone)

// 自定義函式
app.config.globalProperties.$filters = {
  date,
  currency
}

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.component('LoadingOverlay', Loading)
app.component('VForm', Form)
app.component('VField', Field)
app.component('ErrorMessage', ErrorMessage)

app.mount('#app')
