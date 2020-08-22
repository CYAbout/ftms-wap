<template>
  <!--评价列表-->
  <div class="evaluation-container">
    <!--头部-->
    <div class="evaluation-header" v-if="options && !noData">
      <div class="bm-box header">
        <div class="header-left bm-box">
          <div class="left">{{Number(serverData.globalScore).toFixed(1)}}</div>
          <div class="right bm-flex totalScore">
            <div class="span">总体评分</div>
            <stars 
              :starsNum=5 
              :score=serverData.globalScore 
              :starWidth=12 
              :starHeight=12 
              :starMargin=2
              :mark=false>
            </stars>
          </div>
        </div>
        <div class="header-right bm-flex" @click="toEvaluationAll(productId)">全部评价 ({{assessmentListData.length}})</div>
      </div>
      <div class="bm-box header-container">
        <div class="container-li container-li-left score">
          <div class="span">商品满意度 <span>{{Number(serverData.productScore).toFixed(1)}}</span></div>
          <stars 
            :starsNum=5 
            :score=serverData.productScore 
            :starWidth=10 
            :starHeight=10 
            :starMargin=2
            :mark=false>
          </stars>
        </div>
        <div class="bm-flex container-li container-li-center score">
          <div class="span">购物体验 <span>{{Number(serverData.mallScore).toFixed(1)}}</span></div>
          <stars 
            :starsNum=5 
            :score=serverData.mallScore 
            :starWidth=10 
            :starHeight=10 
            :starMargin=2
            :mark=false>
          </stars>
        </div>
        <div class="container-li container-li-right score">
          <div class="span">经销商服务满意度 <span>{{Number(serverData.dealerScore).toFixed(1)}}</span></div>
          <stars 
            :starsNum=5 
            :score=serverData.dealerScore 
            :starWidth=10 
            :starHeight=10 
            :starMargin=2
            :mark=false>
          </stars>
        </div>
      </div>
    </div>
    <!-- 无数据 -->
    <dataEmpty v-if="noData" :options="'suibiangei'"></dataEmpty>
    <!--评价列表内容-->
    <ul class="evaluation-lists" v-else="noData">
      <li v-for="(obj,index) in assessmentListData" :key="index" class="order-item" @click="onItemClick(obj)">
        <!--订单头-->
        <div class="item-header bm-box bm-box-horizontal">
          <div class="bm-flex order-no">评价时间：{{obj.assessmentTime}}</div>
          <div class="order-state">{{obj.order_state || ''}}</div>
        </div>
        <!--订单内容-->
        <div class="item-content bm-box bm-box-horizontal">
          <div class="order-pic" v-if="!options && !noData">
            <img v-lazy="obj.goodsImg"/>
          </div>
          <div class="bm-flex order-info">
            <div class="name" v-if="!options && !noData">{{obj.goodsName || ''}}</div>
            <!-- <div v-if="obj.attrs" v-for="(item, index) in obj.attrs" :key="item.attributeId" class="attribute-item"> -->
            <div class="attribute-item" v-if="!options && !noData">            
              <span> {{obj.assessment}} </span>
            </div>
            <div class="attribute-item" v-if="options && !noData">
              <p class="attribute-item-one">{{obj.assessment}}</p>
              <a v-if='obj.assessment.length > 75' @click="show($event)" href="javascript:void(0)" class="sss">展开</a>
            </div>
            <div class="intention bm-box">
              <div class="intention-left list-score">
                <span>{{Number(obj.globalScore).toFixed(1)}} </span>
                <stars :starsNum=5 :score=obj.globalScore :starWidth=12 :starHeight=12 :starMargin=2></stars>
              </div>
              <div class="bm-flex intention-right">{{obj.loginName}}</div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!--展开更多-->
    <div @click="jump ? toEvaluationAll(productId) : getMoreList" v-show="pageObj.hasNext" class="open-more">
      查看更多<i class="iconfont icon-drop-down"></i>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import Request from '~/plugins/request'
import dataEmpty from '~/components/common/data-empty.vue'
import congratulationsLayer from '~/components/book/layer/congratulations.vue'
import stars from '~/components/evaluation/layer/stars.vue'

export default {
  name: 'order',
  props: [
    'options', // true是商品评价类型， false是个人评价
    'productId', // 商品评价所需的商品id
    'jump' // 用来判断当前的查看更多是跳转还是查看更多功能
  ],
  components: {
    dataEmpty,
    congratulationsLayer,
    stars
  },
  asyncData(context) {
    // async await
    return {
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
      orderObj: {
        // 订单项
        orderNo: ''
      },
      noData: false,
      showAll: false,
      pageObj: {
        totalPage: 1,
        pageSize: 3,
        pageNo: 1,
        hasNext: false
      },
      serverData: [], // 服务器返回的数据
      assessmentListData: [] // 评价列表数据
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
            }
            t.options ? t.listAssessment() : t.queryAssessmentList()// options为false获取个人评价列表信息，true获取商品评价信息
          } catch (error) {
            console.log(error)
          }
        })()
      }
    } else {
      if (t.orderStoreType) {
      }
      t.options ? t.listAssessment() : t.queryAssessmentList()// options为false获取评价列表信息，true获取商品评价信息
    }
  },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    // 获取我的评价列表
    queryAssessmentList() {
      let t = this
      if (t.pageObj.pageNo === 1) {
        t.assessmentListData = []
        t.noData = false
        t.$store.dispatch('setOrderType', '')
      }
      console.log('====', t.userObj.data)
      Request.queryAssessmentList({
        ACCESS_TOKEN: t.userObj.data.token,
        beginPage: t.pageObj.pageNo,
        mobile: t.userObj.data.mobile,
        pageSize: 3
      }).then(result => {
        if (result.success) {
          let obj = result.data || {}
          t.pageObj.totalPage = obj.totalPages || 1
          t.pageObj.hasNext = obj.hasNextPage
          let dataList = obj.dataList || []
          _.each(dataList, (item, key) => {
            item['isCompleteQuestion'] = item.isCompleteQuestion || ''
            item['attrs'] = item.attrs || []
            t.assessmentListData.push(item)
          })
          t.noData = !(t.assessmentListData.length > 0)
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
    // 获取商品评价列表
    listAssessment() {
      let t = this
      if (t.pageObj.pageNo === 1) {
        t.assessmentListData = []
        t.noData = false
        t.$store.dispatch('setOrderType', '')
      }
      Request.listAssessment({
        ACCESS_TOKEN: t.userObj.data.token,
        beginPage: t.pageObj.pageNo,
        pageSize: '2',
        productId: t.productId
      }).then(result => {
        if (result.success) {
          let obj = result.data || {}
          t.pageObj.totalPage = obj.totalPages || 1
          t.pageObj.hasNext = obj.hasNextPage
          t.noData = !(t.assessmentListData.length > 0)
          t.serverData = obj
          t.assessmentListData = obj.basePageObject.dataList
          t.noData = !(t.assessmentListData.length > 0)
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
    getMoreList() {
      let t = this
      console.log(t.pageObj.hasNext)
      t.pageObj.pageNo += 1
      t.options ? t.listAssessment() : t.queryAssessmentList()
    },
    // 返回
    doBack() {
      this.$router.replace('/wx/user')
    },
    // 跳转至全部商品评价页
    toEvaluationAll (id) {
      this.$router.push('/wx/evaluateAll/' + id)
    },
    // 展开收起
    show (e) {
      // this.showAll = !this.showAll
      // console.log(e.target.innerText)
      var text = e.target.innerText
      if (text === '展开') {
        e.target.innerText = '收起'
        e.target.previousSibling.setAttribute('class', 'attribute-item-two')
      } else {
        e.target.innerText = '展开'
        e.target.previousSibling.setAttribute('class', 'attribute-item-one')
      }
    },
    // 关闭弹出层
    doClose(obj) {
      let t = this
      console.log('doClose:>', obj)
      if (obj.type === 'send') {
      } else if (obj.type === 'refund') {
      } else if (obj.type === 'reason') {
      } else if (obj.type === 'refund-success') {
        _.each(t.assessmentListData, (item, key) => {
          if (item.orderNo === obj.orderNo) {
            item.orderStatus = 'REFUND' // 改变状态
          }
        })
      } else if (obj.type === 'congratulations') {
        _.each(t.assessmentListData, (item, key) => {
          // 修改状态
          if (item.orderNo === t.orderObj.orderNo) {
            item.isCompleteQuestion = 'Y' // 已提交
          }
        })
      } else if (obj.type === 'questionnaire') {
      }
    },
    onItemClick(obj) {
      this.$emit('onItemClick', obj)
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import './sass/evaluation-list';
</style>
