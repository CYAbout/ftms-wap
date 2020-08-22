<template>
  <!--订单列表-->
  <div class="order-container">
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">全部评价</div>
      <div class="header-right"></div>
    </div>
    <!-- options:listType false代表个人评价列表；listType true为商品评价列表-->
    <evaluation-list :options="true" :productId="productId"></evaluation-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import evaluationList from '~/components/evaluation/layer/evaluation-list.vue'

export default {
  name: 'evaluateAll',
  components: {
    evaluationList
  },
  asyncData(context) {
    return {
      productId: context.params.id
    }
  },
  head() {
    return {
      title: '一汽丰田官方商城',
      meta: [
        // seo
        { hid: 'keywords', name: 'keywords', content: '' },
        { hid: 'description', name: 'description', content: '' }
      ]
    }
  },
  data() {
    return {
      listType: false
    }
  },
  beforeMount() {},
  mounted() {
    let t = this
    if (!t.userObj.logined) {
      // 获取登录信息
      let userObj = t.$common.getUserInfo() || ''
      if (userObj === '') {
        userObj = t.$common.getUnLoginData()
      }
      if (!userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录失效，是否重新登录?').then(
          action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          },
          cancel => {
            t.$common.clearUserInfo()
            t.$router.replace('/wx')
          }
        )
      } else {
        // 异步调用
        ;(async () => {
          try {
            await t.$store.dispatch('doLogin', userObj)
            console.log('userObj:>', t.userObj)
            if (t.orderStoreType) {
            }
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      if (t.orderStoreType) {
      }
    }
  },
  destroyed() {},
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    // 返回
    doBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import '~/assets/sass/pages/user/evaluation.scss';
</style>
