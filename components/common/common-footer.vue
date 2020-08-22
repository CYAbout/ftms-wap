<template>
  <!--公共尾部-->
  <footer class="common-footer">
    <div class="top-line"></div>
    <div class="footer-content">
      <a :href="userObj.data.token?'https://m.ftms.com.cn/?token='+userObj.data.token:'https://m.ftms.com.cn/'"><img class="logo" src="~/assets/images/top_bottom/logo_bottom.png"/></a>
      <div class="about-us">
        <div class="about-us-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="bm-flex">
            <a class="_link" href="/wx/help">协议条款</a>
          </div>
          <div class="bm-flex">
            <a class="_link" href="/wx/help/shopping">购物指南</a>
          </div>
          <div class="bm-flex">
            <a class="_link"  :href="userObj.data.token?'https://m.ftms.com.cn/brand/profile?token='+userObj.data.token:'https://m.ftms.com.cn/brand/profile'">关于我们</a>
          </div>
        </div>
        <div class="about-us-group bm-box bm-box-horizontal bm-box-vertical-center">
          <!-- <div class="bm-flex">
            <a class="_link" href="/wx">成为经销商</a>
          </div> -->
          <!-- <div class="bm-flex">
            <a class="_link" href="/wx">网站地图</a>
          </div> -->
          <div class="bm-flex"></div>
        </div>
      </div>
      <div class="icon-group bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex"></div>
        <div class="icon-item"><a :href="userObj.data.token?'https://m.ftms.com.cn/?token='+userObj.data.token:'https://m.ftms.com.cn/'"><img src="~/assets/images/top_bottom/home_ico.png"/></a></div>
        
        <div class="icon-item"><img src="~/assets/images/top_bottom/wechat_ico.png" @click="togglePopup('wechat')"/></div>
        <div class="icon-item"><img src="~/assets/images/top_bottom/icon-xcx.png" @click="togglePopup('xcx')" class="large"/></div>
        <div class="icon-item"><a href="https://ftms.tmall.com/"><img src="~/assets/images/top_bottom/tmall_ico.png"/></a></div>
        <div class="bm-flex"></div>
      </div>
      <div class="phone-group bm-box bm-box-horizontal bm-box-vertical-center">
        <a href="tel:4008101210">
          <img class="phone-icon" src="~/assets/images/top_bottom/phone_24_ico.png"/>
        </a>
        <div class="bm-flex">
          <div class="mobile-no"><span>800 810 1210</span><span> (座机拨打）</span></div>
          <div class="mobile-no"><span><a href="tel:4008101210">400 810 1210</a></span><span> (手机拨打）</span></div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="copyright">
        <p>一汽丰田汽车销售有限公司版权所有</p>
        <p>Copyright 2018 FAW TOYOTA Motor Sales Co.,LTD</p>
      </div>
      <div class="record">京ICP备08000601号-17 | 京公网安备110105019374号</div>
    </div>
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade">
        <img v-show="popupType === 'xcx'" src="~/assets/images/top_bottom/xcx.png" alt="">
        <img v-show="popupType === 'wechat'" src="~/assets/images/top_bottom/weixin.png" alt="">
    </mt-popup>
  </footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      popupVisible: false,
      popupType: '',
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
  },
  methods: {
    togglePopup(type) {
      this.popupType = type
      this.popupVisible = !this.popupVisible
    }
  }
}
</script>
<style lang="scss">
@import './sass/common-footer.scss';
</style>
