<template>
  <!--订单列表-->
  <div class="pass-container">
    <!--头部-->
    <div class="pass-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="bm-flex header-title">我的心愿单</div>
      <div class="header-right"></div>
    </div>
    <div class="list-item">
      <div v-for="(obj,index) in attributeBOList" class="goods-item">
        <!-- <div class="title">车款版本</div>
        <div class="collections">
          <div class="c-desc">
            <div class="title">车款版本</div>
            <div class="goods-name">{{obj.goodsName}}</div>
          </div>
          <div class="c-img">
            <img v-lazy="obj.attributeBOList[0].attributeValueBOList[0].colorUrl">
          </div>
          <div></div>
        </div> -->
        <div class="collections">
          <div class="c-desc">
            <div class="title">车款版本</div>
            <div class="goods-name">{{obj.goodsName}}</div>
          </div>
          <div class="c-img">
            <img v-lazy="obj.attributeBOList[0].attributeImgUrl">
          </div>
          <div></div>
        </div>
        <div class="collections">
          <div class="c-desc">
            <div class="title">外观颜色</div>
          </div>
          <div class="c-img color">
            <img v-lazy="obj.attributeBOList[1].attributeImgUrl">
          </div>
          <div></div>
        </div>
        <div class="collections">
          <div class="c-desc">
            <div class="title">内饰</div>
          </div>
          <div class="c-img color">
            <img v-lazy="obj.attributeBOList[2].attributeImgUrl">
          </div>
          <div></div>
        </div>
        <!-- <ul class="collect-lists" v-for="(item, index) in obj.attributeBOList">
          <li v-if="index > 0">
            <img class="setting-img" v-lazy="item.attributeValueBOList[0].colorUrl">
          </li>
        </ul>-->
        <div class="btn" @click='toBuyIt(obj)'>即刻订购</div>
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
      attributeBOList: [],
      goods: {}
    }
  },
  beforeMount() { },
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
        ; (async () => {
          try {
            await t.$store.dispatch('doLogin', userObj)
            console.log('userObj:>', t.userObj)
            t.queryCollectGoodsList() // 获取心愿单信息
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      t.queryCollectGoodsList() // 获取心愿单信息
    }
  },
  destroyed() { },
  computed: {
    ...mapState({
      // 映射
      publicKey: state => state.user.publicKey,
      userObj: state => state.user.user
    })
  },
  methods: {
    // 返回
    doBack() {
      this.$router.replace('/wx/user')
    },
    // 心愿单信息获取
    queryCollectGoodsList() {
      let t = this
      Request.queryCollectGoodsList({
        ACCESS_TOKEN: t.userObj.data.token
      }).then(result => {
        if (result.success) {
          this.attributeBOList = result.data
          console.log('=============')
          console.log(result.data)
          console.log('=============')
        }
      })
    },
    toBuyIt(obj) {
      console.log('===============')
      console.log(obj)
      let t = this
      // 添加所有选中
      const selecctType = obj.attributeBOList[0].attributeValueId
      const selecctColor = obj.attributeBOList[1].attributeValueId
      const selecctInner = obj.attributeBOList[2].attributeValueId
      t.$emit('selected', {
        sort: 1,
        obj: selecctType
      })
      t.$emit('selected', {
        sort: 2,
        obj: selecctColor
      })
      t.$emit('selected', {
        sort: 3,
        obj: selecctInner
      })
      setTimeout(() => {
        t.toMatch(obj, selecctType, selecctColor, selecctInner)
      }, 100)
    },
    // 跳转选配订单
    toMatch(obj, attr1, attr2, attr3) {
      let t = this
      if (!t.userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录后才能订购，是否登录?').then(action => {
          t.syncLoadLayer({
            type: 'login',
            show: true
          })
        }, cancle => {
        })
      } else {
        let goodsAttrs = []
        goodsAttrs[0] = attr1
        goodsAttrs[1] = attr2
        goodsAttrs[2] = attr3
        t.goods.ecPrice = obj.ecPrice
        t.goods.goodsId = obj.goodsId
        t.goods.goodsName = obj.goodsName
        t.goods.productId = obj.productId
        t.goods.goodsAttrs = goodsAttrs
        // let goods = $.extend(true, {}, t.goods)
        // console.log('goods:>', goods)
        t.$cache.goods.set(t.$util.Str.jsonToStr(t.goods))
        t.$router.push('/wx/book/match')
      }
    }
  },
  watch: {}
}
</script>
<style lang="scss">
@import "~/assets/sass/pages/user/collectGoods.scss";
</style>
