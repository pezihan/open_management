import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
// 导入 nprogress 顶部进度条条 包对应的js和css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入全局样式标
import '@/assets/css/global.css'

// 导入阿里图标
import '@/assets/fonts/iconfont.css'

// 配置请求的后端根路径
axios.defaults.baseURL = 'http://127.0.0.1:4000/open'
// 配置axios的request拦截器添加token验证,保证拥有获取数据的权限(在请求头中添加token属性)和添加 Nprogress 进度条 Nprogress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  Nprogress.start() // 展示进度条
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

// 在 response Nprogress.done()
axios.interceptors.response.use(config => {
  Nprogress.done() // 隐藏进度条
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

// 将时间处理函数挂在到vue的上全局可以使用(vue过滤器) 传入毫秒数转换成时间格式
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear() // 年
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月
  const d = (dt.getDate() + '').padStart(2, '0') // 日

  const hh = (dt.getHours() + '').padStart(2, '0') // 小时
  const mm = (dt.getMinutes() + '').padStart(2, '0') // 分
  const ss = (dt.getSeconds() + '').padStart(2, '0') // 秒
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.filter('dateBirth', function (originVal) { // 员工出生的过滤函数
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear() // 年
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月
  const d = (dt.getDate() + '').padStart(2, '0') // 日
  return `${y}年${m}月${d}日`
})

Vue.filter('sexConvert', function (data) { // 过滤性别
  if (data === 0) {
    return '男'
  } else {
    return '女'
  }
})

Vue.filter('typeConvert', function (data) { // 过滤账户类型
  if (data === 0) {
    return '管理员'
  } else {
    return '普通账户'
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
