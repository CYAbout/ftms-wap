<template>
  <!--订单列表-->
  <div class="msg-container">
    <!--头部-->
    <div class="msg-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">我的消息</div>
    </div>
    <!--选项卡-->
    <div class="msg-tabs bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="showType = 'all'" class="tab-item" :class="{'active': showType === 'all'}">全部消息</div>
      <div @click="showType = 'personnel'" class="bm-flex tab-item" :class="{'active': showType === 'personnel'}">系统消息</div>
      <div @click="showType = 'personal'" class="bm-flex tab-item" :class="{'active': showType === 'personal'}">订阅消息</div>
    </div>
    <!--订单列表内容-->
    <ul class="msg-lists">
      <!-- 全选框 -->
      <!-- <input type="checkbox" class="msg-select-all" v-model="allChecked" v-if="!flag" @click="checkAll"/> -->
      <li v-for="(obj,index) in _msgList" :key="index" class="msg-item"  @click="flag?toDetails(obj.id):(obj.checked=true)">
          <!--订单详情-->
             <!-- <input type="checkbox" class="msg-select" v-model="obj.checked" v-if="!flag"/>
          <label class="msg-select_label" for="" v-if="!flag"></label> -->
          <div class="msg-select-active" v-if="!flag" @click="showActive($event)"></div>
          <div class="msg-item-head">
            <div :class="{'msg-item-title':true,'msg-item-title-active':obj.readStatus !== 'N' }">
              {{obj.title}}
            </div>
             <div class="msg-item-time" v-if="flag">{{obj.sendtime}}</div>
          </div>
          <div class="msg-item-bottom">
              <div class="msg-item-detail">
                {{obj.simpleContent}}
              </div>
              <!-- <div class="msg-item-status" v-if="flag">{{obj.readStatus === 'N'?'系统消息':'订阅消息'}}</div> -->
              <div class="msg-item-status" v-if="flag">{{obj.msgType === 'personnel'?'系统消息':'订阅消息'}}</div>
          </div>
      </li>
    </ul>
    <div @click='getMoreList' v-show='pageObj.hasNext' class="btnMore">查看更多<i class="iconfont icon-drop-down"></i></div>
     <div class="msg-footer">
      <div class="msg-footer-btn" @click="patchDelete();showToggle()" v-text="flag?'批量删除':'删除'"></div>
      <div class="msg-footer-btn" @click="patchRead();showToggle()" v-text="flag?'批量已读':'已读'"></div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import Request from '~/plugins/request'

export default {
  name: 'message',
  components: {
  },
  asyncData(context) {
    // async await
    return {
      // 订单状态
      // 待支付 COMMIT
      // 已支付 PAID
      // 退款中 REFUND
      // 已退款REFUNDED
      // 已取消CANCELED
      orderType: context.params.type || '' // all
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
      pageObj: {
        totalPage: 1,
        pageSize: 10,
        pageNo: 1,
        hasNext: false,
        msgType: 'all'
      },
      ORDER_STATUS: {
        personnel: '系统消息',
        personal: '订阅消息'
      },
      msgList: [],
      flag: true,
      showType: 'all'
    }
  },
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
              t.orderType = t.orderStoreType
            }
            t.getMsgList() // 获取订单列表信息
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      if (t.orderStoreType) {
        t.orderType = t.orderStoreType
      }
      t.getMsgList() // 获取订单列表信息
      // t.getSysCodeValuesNewOrderType() // 获取订单类型
    }
  },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user,
      orderStoreType: state => state.user.orderType
    }),
    checkedMsgIds() {
      return this.msgList.filter(el => el.checked).map(el => el.id)
    },
    _msgList() {
      if (this.showType === 'all') return this.msgList
      if (this.showType === 'personnel') return this.msgList.filter(el => el.msgType === 'personnel')
      return this.msgList.filter(el => el.msgType !== 'personnel')
    },
    allChecked() {
      return !!this._msgList.length && this._msgList.every(el => el.checked)
    }
  },
  methods: {
    showActive(e) {
      let name = e.target.getAttribute('class')
      if (name === 'msg-select-active') {
        e.target.setAttribute('class', 'msg-select')
      } else {
        e.target.setAttribute('class', 'msg-select-active')
      }
    },
    checkAll() {
      const flag = !this.allChecked
      this._msgList.forEach(el => { el.checked = flag })
    },
    getMsgList() {
      console.log('=====', this.userObj)
      Request.messageList({
        ACCESS_TOKEN: this.userObj.data.token,
        pageSize: this.pageObj.pageSize,
        beginPage: this.pageObj.pageNo,
        msgType: '',
        memberId: this.userObj.data.idCard
      }).then(result => {
        if (result.success) {
          console.log(result, '111111111111')
          let obj = result.data || {}
          this.pageObj.totalPage = obj.totalPages || 1
          this.pageObj.hasNext = obj.hasNextPage
          this.newmsgList = (obj.dataList || []).map(el => ({...el, checked: false}))
          for (let i = 0; i < this.newmsgList.length; i++) {
            this.msgList.push(this.newmsgList[i])
          }
          console.log('-=-=-=-=-=-=', this.msgList)
        } else if (result.code === '-10') {
          this.$messageBox.confirm('登录失效，是否重新登录?').then(
            action => {
              this.syncLoadLayer({
                type: 'login',
                show: true
              })
            },
            cancel => {
              this.$common.clearUserInfo()
              this.$router.replace('/wx')
            }
          )
        } else {
          this.$toast(result.msg)
        }
      })
    },
    // 获取所有订单信息
    orderList(newOrderType) {
      let t = this
      if (t.pageObj.pageNo === 1) {
        t.orderListData = []
        t.$store.dispatch('setOrderType', '')
      }
      // 获取订单信息
      Request.orderList({
        ACCESS_TOKEN: t.userObj.data.token,
        orderStatus: t.orderType === 'all' ? '' : t.orderType,
        pageSize: t.pageObj.pageSize,
        beginPage: t.pageObj.pageNo,
        orderType: newOrderType || ''
      }).then(result => {
        if (result.success) {
          let obj = result.data || {}
          t.pageObj.totalPage = obj.totalPages || 1
          t.pageObj.hasNext = obj.hasNextPage
          let dataList = obj.dataList || []
          _.each(dataList, (item, key) => {
            item['isCompleteQuestion'] = item.isCompleteQuestion || ''
            item['order_state'] = t.ORDER_STATUS[item.orderStatus] || ''
            item['pay_state'] = t.PAY_STATUS[item.payStatus] || ''
            item['attrs'] = item.attrs || []
            t.orderListData.push(item)
          })
        } else if (result.code === '-10') {
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
          t.$toast(result.msg)
        }
      })
    },
    // 获取订单新类型
    getSysCodeValuesNewOrderType() {
      Request.getSysCodeValuesNewOrderType('', 'order_type').then(result => {
        if (result.success) {
          this.newOrderListData = result.data
        } else if (result.code === '-10') {
          this.$messageBox.confirm('登录失效，是否重新登录?').then(
            action => {
              this.syncLoadLayer({
                type: 'login',
                show: true
              })
            },
            cancel => {
              this.$common.clearUserInfo()
              this.$router.replace('/wx')
            }
          )
        } else {
          this.$toast(result.msg)
        }
      })
    },
    // 查看更多
    getMoreList() {
      let t = this
      t.pageObj.pageNo += 1
      t.getMsgList() // 获取信息
    },
    // 跳转订单详情
    toDetails(msgId) {
      let t = this
      t.$router.push('/wx/user/myMessage/deatils/' + msgId)
      Request.dealMsgList({
        ACCESS_TOKEN: this.userObj.data.token,
        memberId: this.userObj.data.idCard,
        dealType: 'read',
        msgIds: [msgId]
      }).then(res => {
        if (!res.success) {
          return this.$toast(res.msg)
        }
      })
    },
    // 返回
    doBack() {
      this.$router.replace('/wx/user')
    },
    // 批量删除
    patchDelete() {
      console.log('===执行patchDelete', this.checkedMsgIds)
      Request.dealMsgList({
        ACCESS_TOKEN: this.userObj.data.token,
        memberId: this.userObj.data.idCard,
        dealType: 'del',
        msgIds: this.checkedMsgIds
      }).then(res => {
        console.log('====dealMsgList', res)
        if (!res.success) {
          return this.$toast(res.msg)
        }
        this.msgList = this.msgList.filter(el => !el.checked)
      })
    },
    // 批量已读
    patchRead() {
      Request.dealMsgList({
        ACCESS_TOKEN: this.userObj.data.token,
        memberId: this.userObj.data.idCard,
        dealType: 'read',
        msgIds: this.checkedMsgIds
      }).then(res => {
        if (!res.success) {
          return this.$toast(res.msg)
        }
        this.msgList.forEach(el => {
          if (el.checked) {
            el.readStatus = 'Y'
            el.checked = false
          }
        })
      })
    },
    // 点击隐藏时间和类型
    showCont: function() {
      this.show = !this.show
      this.shown = !this.shown
    },
    showToggle: function() {
      this.flag = !this.flag
      if (this.flag === true) {
        this.btnText = '批量删除'
        this.brnText = '批量已读'
      } else if (this.flag === false) {
        this.btnText = '删除'
        this.brnText = '已读'
      }
    }
  },
  watch: {
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import '~/assets/sass/pages/user/msg.scss';
</style>
