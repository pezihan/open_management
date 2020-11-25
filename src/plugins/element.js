import Vue from 'vue'
import {
  Button,
  MessageBox,
  Message
} from 'element-ui'

Vue.use(Button)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message // 弹窗组件必须挂在在vue的原型上
