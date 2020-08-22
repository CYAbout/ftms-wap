<template>
  <!--消息详情-->
  <div class="order-details-container">
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">消息详情</div>
      <div class="header-right"></div>
    </div>

    <!--消息内容-->
    <div class="order-content">
      <!--消息基本信息-->
      <ul class="order-basic">
        <!-- <li class="basic-item bm-box bm-box-horizontal">
          <div class="bm-flex">消息ID：{{msgObj.id || ''}}</div>
        </li>
        <li class="basic-item">消息标题：{{msgObj.title || ''}}</li>
        <li class="basic-item">消息类型：{{msgObj.readStatus?msgObj.readStatus ==='N'?"未读":"已读": ''}}</li>
        <li class="basic-item">消息日期：{{msgObj.sendtime || ''}}</li>
        <li class="basic-item">消息内容：{{msgObj.msgContent || ''}}</li> -->
        <div class="msg-title">{{msgObj.title || ''}}</div>
        <div class="msg-time">{{msgObj.sendtime || ''}}</div>
        <div class="msg-detail">{{msgObj.msgContent || ''}}</div>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  // import _ from 'lodash'
  import Request from '~/plugins/request'

  export default {
    name: 'message-details',
    components: {
    },
    asyncData (context) { // async await
      return {
        orderNo: context.params.no
      }
    },
    head () {
      return {
      }
    },
    data () {
      return {
        orderObj: {}, // 订单信息
        attrList: [], // 商品属性
        goodsInfo: {},
        msgObj: {}
      }
    },
    mounted () {
      let t = this
      if (!t.userObj.logined) { // 获取登录信息
        let userObj = t.$common.getUserInfo() || ''
        if (userObj === '') {
          userObj = t.$common.getUnLoginData()
        }
        if (!userObj.logined) { // 未登录
          t.$common.clearUserInfo()
          t.$messageBox.confirm('登录失效，是否重新登录?').then(action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          }, cancel => {
            t.$common.clearUserInfo()
            t.$router.replace('/wx')
          })
        } else {
          // 异步调用
          (async () => {
            try {
              await t.$store.dispatch('doLogin', userObj)
              console.log('userObj:>', t.userObj)
              t.getMsgDetail() // 获取订单详情
            } catch (error) {
              console.log(error)
            }
          })()
        }
      } else {
        t.getMsgDetail() // 获取订单详情
      }
    },
    destroyed () {
    },
    computed: {
      ...mapState({ // 映射
        userObj: state => state.user.user
      })
    },
    methods: {
      // 获取消息详情
      getMsgDetail () {
        let t = this
        Request.messageDetail({
          ACCESS_TOKEN: t.userObj.data.token
        }, t.orderNo).then(result => {
          if (result.success) {
            console.log('result:', result)
            this.msgObj = result.data
          } else if (result.code === '-10') {
            t.$messageBox.confirm('登录失效，是否重新登录?').then(action => {
              t.syncLoadLayer({
                type: 'login',
                show: true
              })
            }, cancel => {
              t.$common.clearUserInfo()
              t.$router.replace('/wx')
            })
          } else {
            t.$toast(result.msg)
          }
        })
      },
      // 返回
      doBack () {
        // this.$router.go(-1)
        this.$router.replace('/wx/user/myMessage/all')
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/assets/sass/pages/user/msg-detail.scss';
</style>
