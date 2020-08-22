<template>
  <!--卡券列表-->
  <div class="ticket-container">
    <!--头部-->
    <div class="ticket-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">我的卡券</div>
      <div class="header-right"></div>
    </div>
    <!--选项卡-->
    <div class="ticket-tabs bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click.stop="judge('all')" class="bm-flex tab-item" :class="{'active': orderType === 'all'}">未使用</div>
      <div @click.stop="judge('COMMIT')" class="bm-flex tab-item" :class="{'active': orderType === 'COMMIT'}">已使用</div>
      <div @click.stop="judge('PAID')" class="bm-flex tab-item" :class="{'active': orderType === 'PAID'}">已过期</div>
    </div>

    <!--无数据-->
    <data-empty v-if="noData" :options="orderType"></data-empty>

    <!--卡券列表内容-->
    <ul v-else class="ticket-lists">
      <li v-for="(card, index) in cardVoucherList" :key="index" class="ticket-item ticket-before">
        <!--订单内容-->
        <div class="item-content bm-box bm-box-horizontal" :class="showCardType(orderType)">
          <div class="ticket-pic">
            <div class="top"><span>{{card.listPrice}}</span></div>
            <div class="bottom">[{{card.depositPrice}}元抵{{card.listPrice}}元]</div>
          </div>
          <div class="bm-flex ticket-info">
            <!-- <div class="name">{{card.goodsName}}</div> -->
            <div class="attribute-item">
              <span>卡券名称：</span> {{card.goodsName}}
            </div>
            <div class="attribute-item">
              <span>卡券用途：</span> {{card.cardUse}}
            </div>
            <!-- <div class="attribute-item">
              <span>适用规则：</span> {{card.depositPrice}}元抵{{card.listPrice}}元
            </div> -->
            <div class="intention">有效期：{{dateFormat(card.effectTime,"yyyy-MM-dd")}}-{{dateFormat(card.expireTime,"yyyy-MM-dd")}}</div>
          </div>
          <!-- mark标记 -->
          <div class="cardMark" v-show="orderType==='all'?false:true" :class="showMarkType(orderType)"></div>
        </div>
      </li>
    </ul>
    <!--展开更多-->
    <div @click="getMoreList(currentCardType)" v-show="pageObj.hasNextPage" class="open-more">
      查看更多<i class="iconfont icon-drop-down"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Request from '~/plugins/request'
import dataEmpty from '~/components/common/data-empty.vue'

export default {
  name: 'order',
  components: {
    dataEmpty
  },
  asyncData(context) {
    return {
      orderType: context.params.type || 'all' // all
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
      noData: false,
      pageObj: {
        totalPage: 1,
        pageSize: 3,
        pageNo: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },
      cardVoucherList: [], // 订单列表
      currentCardType: 'unused' // 当前卡券类型
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
            t.cardVouchersList() // 获取订单列表信息
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      if (t.orderStoreType) {
        t.orderType = t.orderStoreType
      }
      t.cardVouchersList() // 获取订单列表信息
    }
  },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user,
      orderStoreType: state => state.user.orderType
    })
  },
  methods: {
    // 判断选项卡
    judge (type) {
      let typeSelector = new Map([
        ['all', () => {
          this.orderType = 'all'
          this.pageObj.pageSize = 1
          this.cardVouchersList('unused')
        }],
        ['COMMIT', () => {
          this.orderType = 'COMMIT'
          this.pageObj.pageSize = 1
          this.cardVouchersList('used')
        }],
        ['PAID', () => {
          this.orderType = 'PAID'
          this.pageObj.pageSize = 1
          this.cardVouchersList('stale')
        }]
      ])
      return typeSelector.get(type).call()
    },
    showCardType (type) {
      console.log(type)
      switch (type) {
        case 'all': return 'cardType-unused'
        case 'COMMIT': return 'cardType-used'
        case 'PAID': return 'cardType-uptodate'
        default: return 'cardType-unused'
      }
    },
    showMarkType (type) {
      console.log(type)
      switch (type) {
        case 'all': return 'markType-used'
        case 'COMMIT': return 'markType-used'
        case 'PAID': return 'markType-overdue'
        default: return 'markType-used'
      }
    },
    // 获取订单列表信息
    cardVouchersList(type) {
      let t = this
      Request.cardVouchersList({
        ACCESS_TOKEN: t.userObj.data.token,
        beginPage: 1,
        orderStatus: type || 'unused',
        pageSize: this.pageObj.pageSize
      }).then(result => {
        if (result.success) {
          console.log('接口fanhuide 数据在这里：-====', result)
          this.pageObj.hasNextPage = result.data.hasNextPage
          this.cardVoucherList = result.data.dataList
          this.currentCardType = type || 'unused'
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
    // 查看更多
    getMoreList(type) {
      let t = this
      t.pageObj.pageSize += 3
      t.cardVouchersList(type) // 获取订单列表信息
    },
    // 格式化时间戳
    dateFormat(millionsTime, pattern) {
      var d = new Date()
      d.setTime(millionsTime)
      var date = {
        'M+': d.getMonth() + 1,
        'd+': d.getDate(),
        'h+': d.getHours(),
        'm+': d.getMinutes(),
        's+': d.getSeconds(),
        'q+': Math.floor((d.getMonth() + 3) / 3),
        'S+': d.getMilliseconds()
      }
      if (/(y+)/i.test(pattern)) {
        pattern = pattern.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in date) {
        if (new RegExp('(' + k + ')').test(pattern)) {
          pattern = pattern.replace(RegExp.$1, RegExp.$1.length === 1
            ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
        }
      }
      return pattern
    },
    // 返回
    doBack() {
      this.$router.replace('/wx/user')
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import '~/assets/sass/pages/user/ticket.scss';
</style>
