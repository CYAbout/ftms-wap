<template>
  <!--帮助中心-->
  <div class="help-container">
    <!--头部-->
    <div class="help-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">帮助中心</div>
      <div class="header-right"></div>
    </div>

    <!--内容区-->
    <div class="help-content">
      <ul class="help-list">
        <!--协议条款-->
        <li class="help-item bm-box bm-box-horizontal">
          <div class="main-icon"><i class="iconfont icon-people"></i></div>
          <div class="bm-flex main-title">协议条款</div>
        </li>
        <li @click="doTagger('agreement')" class="help-item bm-box bm-box-horizontal">
          <div class="bm-flex help-title">用户注册协议</div>
          <div class="icon"><i class="iconfont icon-next"></i></div>
        </li>
        <li @click="doTagger('mallservice')" class="help-item bm-box bm-box-horizontal">
          <div class="bm-flex help-title">商城服务协议</div>
          <div class="icon"><i class="iconfont icon-next"></i></div>
        </li>
        <!--购物指南-->
        <li class="help-item bm-box bm-box-horizontal">
          <div class="main-icon"><i class="iconfont icon-nav"></i></div>
          <div class="bm-flex main-title">购物指南</div>
        </li>
        <li @click="toPage('/wx/help/shopping')" class="help-item bm-box bm-box-horizontal">
          <div class="bm-flex help-title">购物流程</div>
          <div class="icon"><i class="iconfont icon-next"></i></div>
        </li>
        <!--
        <li class="help-item bm-box bm-box-horizontal">
          <div class="bm-flex help-title">支付流程</div>
          <div class="icon"><i class="iconfont icon-next"></i></div>
        </li> -->
        <!-- <li class="help-item bm-box bm-box-horizontal">
          <div class="bm-flex help-title">退款流程</div>
          <div class="icon"><i class="iconfont icon-next"></i></div>
        </li>
        -->
        <li @click="toPage('/wx/help/problem')" class="help-item bm-box bm-box-horizontal">
          <div class="bm-flex help-title">常见问题</div>
          <div class="icon"><i class="iconfont icon-next"></i></div>
        </li>
        <!--关于我们-->
        <li class="help-item bm-box bm-box-horizontal">
          <div class="main-icon"><i class="iconfont icon-people"></i></div>
          <div class="bm-flex main-title">关于我们</div>
        </li>
        <li class="help-item bm-box bm-box-horizontal">
          <!-- <a class="bm-flex help-title" href="https://m.ftms.com.cn/introduce">关于我们</a> -->
          <a class="bm-flex help-title" :href="userObj.data.token?'https://m.ftms.com.cn/brand/profile?token='+userObj.data.token:'https://m.ftms.com.cn/brand/profile'">关于我们</a>
          <div class="icon"><i class="iconfont icon-next"></i></div>
        </li>
      </ul>
    </div>
    <agreement :show='isAgreement' @close='doClose' ></agreement>
    <terms-service :show='istermsService' @close='doClose' ></terms-service>

  </div>
</template>

<script>
import agreement from '~/components/common/layer/agreement2.vue'
import termsService from '~/components/common/layer/terms-service.vue'

import { mapState } from 'vuex'
export default {
  name: 'help',
  components: {
    agreement,
    termsService
  },
  data() {
    return {
      isAgreement: false, // 用户注册协议
      istermsService: false, // 商城服务协议
      token: ''
    }
  },
  computed: {
    ...mapState({
      userObj: state => state.user.user
    })
  },
  mounted() {
    this.token = this.userObj.data.token
    console.log(this.userObj.data.token)
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
  methods: {
    // 跳转页面
    toPage(path = '') {
      if (path) {
        this.$router.push(path)
      }
    },
    // 返回
    doBack() {
      this.$router.go(-1)
    },
    // 协议
    doTagger(type) {
      if (type === 'agreement') {
        this.isAgreement = true
      } else {
        this.istermsService = true
      }
    },
    doClose(ev) {
      if (ev.type === 'agreement') {
        this.isAgreement = ev.show
      } else {
        this.istermsService = ev.show
      }
      console.log(ev)
    }
  }
}
</script>
<style lang="scss">
//noinspection CssUnknownTarget
@import '~/assets/sass/pages/help/index.scss';
</style>
