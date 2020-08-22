/**
 * mint-ui element-ui移动版
 */
// 引入全部组件
import Vue from 'vue'
// import Mint from 'mint-ui'
// import 'mint-ui/lib/style.css'
//
// Vue.use(Mint)

// 按需引入部分组件
import {
  Swipe,
  SwipeItem,
  Navbar,
  TabItem,
  TabContainer,
  TabContainerItem,
  Popup,
  Picker,
  Field,
  Spinner,
  Lazyload,
  Toast,
  Indicator,
  MessageBox,
  DatetimePicker,
  Radio
} from 'mint-ui'

// import 'mint-ui/lib/font/style.css' // 图标
import 'mint-ui/lib/swipe/style.css' // 轮播
import 'mint-ui/lib/button/style.css' // 按钮
import 'mint-ui/lib/navbar/style.css' // 选项卡
import 'mint-ui/lib/tab-item/style.css'
import 'mint-ui/lib/tab-container/style.css' // 面板
import 'mint-ui/lib/popup/style.css' // 弹出框
import 'mint-ui/lib/picker/style.css' // 选择器
import 'mint-ui/lib/field/style.css' // 表单编辑器
import 'mint-ui/lib/spinner/style.css' // 加载动画
import 'mint-ui/lib/lazyload/style.css' // Lazy load
import 'mint-ui/lib/toast/style.css' // Toast
import 'mint-ui/lib/indicator/style.css' // Indicator
import 'mint-ui/lib/message-box/style.css' // MessageBox

import '~/assets/sass/mint-ui-reset.scss'

Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Navbar.name, Navbar)
Vue.component(TabItem.name, TabItem)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Popup.name, Popup)
Vue.component(Picker.name, Picker)
Vue.component(Field.name, Field)
Vue.component(Spinner.name, Spinner)
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component(Radio.name, Radio)
Vue.use(Lazyload)

Vue.prototype.$toast = Toast
Vue.prototype.$loading = Indicator
Vue.prototype.$messageBox = MessageBox
