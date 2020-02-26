import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入element-ui组件库
import ElementUI from 'element-ui'
// 导入element-ui组件相关样式
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
// 导入字体图标
import './assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// 配置vue插件
Vue.use(ElementUI)
Vue.config.productionTip = false

// 为axios请求设置拦截器，在其请求头中添加token
// config为请求对象
// 将token放在请求头中，发送请求
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
