<template>
  <!--订单列表-->
  <div class="order-details-container">
    <!--头部-->
    <div class="order-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">我的预约</div>
      <div class="header-right"></div>
    </div>
    <div class="order">
      <div v-for="(obj,index) in driveList" class="order-content">
        <ul class="order-basic">
          <li class="basic-item bm-box bm-box-horizontal">
            <!--<div class="bm-flex">预约编号：{{obj.no || ''}}</div>-->
            <!--退款单状态-->
            <div class="order-state">{{obj.status}}</div>
          </li>
          <li class="basic-item">车系车型：{{obj.productname}}</li>
          <li class="basic-item bm-box bm-box-horizontal">试驾人：{{obj.name}}</li>
          <li class="basic-item bm-box bm-box-horizontal">手机号：{{obj.mobile}}</li>
          <li class="basic-item bm-box bm-box-horizontal">经销商：{{obj.dealerName}}</li>
          <li class="basic-item bm-box bm-box-horizontal" v-if="obj.productname=='威尔法双擎' || obj.productname=='86' || obj.productname=='COASTER 柯斯达'">咨询时间：{{obj.driveDate}}</li>
          <li class="basic-item bm-box bm-box-horizontal" v-else>试驾时间：{{obj.driveDate}}</li>
          <li class="basic-item bm-box bm-box-horizontal">预计购车时间：{{obj.planShoppingTime}}</li>
          <li class="bm-box bm-box-horizontal sealInfo">{{obj.address}} 电话 ：{{one(obj.phoneSeal)}}</li>
          <div class="status-change">
            <li v-if="obj.subscribeStatus == 'CANCEL'">已取消</li>
            <li v-if="obj.subscribeStatus == 'COMMIT'">已提交</li>
            <li v-if="obj.subscribeStatus == 'FAILED'">退款中</li>
          </div>
        </ul>
        <!--操作按钮-->
        <div v-if="(obj.subscribeStatus !== 'CANCEL' && obj.subscribeStatus !== 'FAILED')" class="operation-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="bm-flex"></div>
          <!--退款中-->
          <div class="btn-item" v-if="(obj.subscribeStatus !== 'CANCEL' && obj.subscribeStatus !== 'FAILED')"  @click="updateSubscribeStatus(obj.id, index)">取消预约</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Request from '~/plugins/request'
  import congratulationsLayer from '~/components/book/layer/congratulations.vue'

  export default {
    name: 'order',
    components: {
      congratulationsLayer
    },
    head () {
      return {
        title: '一汽丰田官方商城',
        meta: [ // seo
          {hid: 'keywords', name: 'keywords', content: ''},
          {hid: 'description', name: 'description', content: ''}
        ]
      }
    },
    data () {
      return {
        driveList: [],
        shijiaorzixun:true
      }
    },
    beforeMount () {},
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
              t.queryDriveList() // 获取预约信息
            } catch (error) {
              console.log(error)
            }
          })()
        }
      } else {
        t.queryDriveList() // 获取预约信息
      }
    },
    destroyed () {},
    computed: {
      ...mapState({ // 映射
        publicKey: state => state.user.publicKey,
        userObj: state => state.user.user
      })
    },
    methods: {
      one (str) {
        let newStr = str.split('/')[0]
        return newStr
      },
      // 返回
      doBack () {
        this.$router.replace('/wx/user')
      },
      // 获取预约信息
      queryDriveList () {
        let t = this
        Request.queryDriveList({
          ACCESS_TOKEN: t.userObj.data.token
        }).then(result => {
          if (result.success) {
            this.driveList = result.data
            console.log(this.driveList)
          }
        })
      },
      updateSubscribeStatus (id, ind) {
        let t = this
        this.$messageBox.confirm('确定要取消预约吗?').then(action => {
          Request.updateSubscribeStatus('', id).then(result => {
            if (result.success) {
              t.queryDriveList()
            }
          })
        }, cancel => {})
      }
    },
    filters: {
      // 时间戳格式过滤
      formatDate: function (value) {
        let date = new Date(value)
        let y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? ('0' + MM) : MM
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '-' + MM + '-' + d
      }
    },
    watch: {
    }
  }
</script>
<style lang="scss">
  @import '~/assets/sass/pages/user/queryDriverList.scss';
</style>
