import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入element-ui组件库
import ElementUI from 'element-ui'
// 导入element-ui组件相关样式
import 'element-ui/lib/theme-chalk/index.css'
// 配置vue插件
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
