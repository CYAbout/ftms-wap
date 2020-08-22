<template>
  <div class="sales-container">
    <!-- <div style="width:100%;height:6rem;background:red;">
      <p @click="agreeRule" style="width:2rem;height:2rem;background:yellow;"></p>
    </div> -->
    <div class="bg_act"><img src="~/assets/images/home/wap_yhct_bg.jpg" alt=""></div>
    <div class="pop_wrap">
      <div class="pop_content">
        <h3>官方商城“约惠春天”活动规则</h3>
        <div class="text">
          <p>【活动时间】</p>
          <p>2019年4月1日00:00:00-2019年4月7日23:59:59</p>
          <p>【购车抵扣券抢购时间】</p>
          <p>2019年4月4日10:00:00-2019年4月7日23:59:59</p>
          <p>【抵扣券有效期】</p>
          <p>2019年4月4日10:00:00-2019年4月30日23:59:59</p>
          <p>【参与方式】</p>
          <p>一．      <b>沐春有礼 一起“丰”抢活动：</b></p>
          <p>1.     规则说明</p>
          <p>①    抢购期间，凡购买卡罗拉（不含双擎版）/荣放/奕泽三款车型中任意一款车型购车抵扣券的用户可参与抽奖，每人每天1次抽奖机会;</p>
          <p>②    抢购期间，根据卡罗拉（不含双擎版）/荣放/奕泽三款车型参与购券的人数总数可抽取不同阶段的成交礼;</p>
          <p>③    中奖信息将以短信形式发送到您的手机，请注意保存，短信删除不再补发；</p>
          <p>④    活动期间抽中奖品的用户，<b>须在4月30日前完成购车</b>，客服会在您购车后的15个工作日内联系您核实购车信息，核实无误后奖品将在30个工作日内寄出；</p>
          <p>⑤    您于本平台提供的个人信息，仅用于本次活动一汽丰田汽车销售有限公司与您沟通联络时使用。若预留信息有误，无法联系到您，且无主动反馈，视为自动放弃获奖资格；</p>
          <p>2.     奖品内容：</p>
          <p>①    购券人数达到2000人时，则有机会赢取价值150元手机托架一个；</p>
          <p>②    购券人数达到3000人时，则有机会赢取价值360元膳魔师保温杯一个；</p>
          <p>③    购券人数达到4000人时，则有机会赢取价值1080元TNGA 20寸拉杆箱一个；</p>
          <p>④    购券人数达到6000人时，则有机会赢取价值2900元户外礼包套餐一份；</p>
          <p>二．      <b>购车抵扣券抢购活动：</b></p>
          <p>1.     支付99元抢购购车抵扣券：</p>
          <p>①    IZOA 奕泽 </p>
          <p><b>支付99元</b>抢购价值<b>1500元</b>购车抵扣券，到店成功购车可直接抵扣相应金额 </p>
          <p>②    RAV4 荣放</p>
          <p><b>支付99元</b>抢购价值<b>2000元</b>购车抵扣券，到店成功购车可直接抵扣相应金额 </p>
          <p>③    COROLLA卡罗拉</p>
          <p><b>支付99元</b>抢购价值<b>1000元</b>购车抵扣券，到店成功购车可直接抵扣相应金额  </p>
          <p>④    COROLLA HYBRID 卡罗拉双擎</p>
          <p><b>支付99元</b>抢购价值<b>1200元</b>购车抵扣券，到店成功购车可直接抵扣相应金额 </p>
          <p>⑤    VIOS 威驰</p>
          <p><b>支付99元</b>抢购价值<b>666元</b>购车抵扣券，到店成功购车可直接抵扣相应金额 </p>
          <p>⑥    VIOS FS 威驰FS</p>
          <p><b>支付99元</b>抢购价值<b>666元</b>购车抵扣券，到店成功购车可直接抵扣相应金额 </p>
          <p>2.     规则说明：</p>
          <p>①    用户需要在下单后15分钟内支付99元订金，否则交易取消</p>
          <p>②    同一手机号同款车型仅限购买<b>1</b>张<b>购车抵扣券、当天购买当天即可使用</b></p>
          <p>③    购车抵扣券仅限在意向城市内经销店使用</p>
          <p>④    同款车型仅限使用1张购车抵扣券本活动所有政策仅针对新购车用户（即2019年4月4日-2019年4月30日期间购车用户）</p>
          <p>⑤    以上政策不能与C级及以上车展政策同享</p>
          <p>3.     退款说明：</p>
          <p>活动结束后（2019年4月30日），无论用户是否购车，所支付的99元购车抵扣券费用均由系统在30天内按支付顺序原路退还 。</p>
        </div>
        <p class="btn_wrap">
          <span @click="goBack">不同意</span>
          <span @click="agreeRule">同意</span>
        </p>
      </div>
    </div>
    <a href="http://www.knowology.cn:8082/OnlineCustomer_YQFT/index.html" target="_blank">
      <div v-if="iconShow" class="iconShow">
        <img src="~/assets/images/home/float_online.png"/>
      </div>
    </a>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import Request from '~/plugins/request.js'

  export default {
    name: 'yhctzcgz',
    components: {

    },
    head() {
      return {
      }
    },
    data() {
      return {
        form: {
          name: '',
          phone: '',
          idCardNo: '',
          realName: '',
          idCard: '',
          hasCardNo: false,
          hasName: ''
        },
        groupid: '',
        iconShow: false
      }
    },
    mounted() {
      this.groupid = this.$util.Params.query('groupid') || ''
      window.localStorage.setItem('groupid', this.groupid)
      this.getActivityState()
    },
    methods: {
      getActivityState() {
        let t = this
        Request.getActivityState().then(v => {
          if (v.code === '0') {
            if (v.data.activityStage === '2' || v.data.activityStage === '3' || v.data.activityStage === '4') {
              t.iconShow = true
            }
          }
        })
      },
      goLine() {
        window.location.href = 'http://www.knowology.cn:8082/OnlineCustomer_YQFT/index.html'
      },
      agreeRule() {
        this.$router.push('/wx/yhctActPage')
      },
      // 跳转
      skipPage(id) {
        let t = this
        window.location.hash = '#' + id
        setTimeout(() => { // 清除hash
          t.$router.replace('')
        }, 600)
      },
      goBack() {
        this.$router.push('/wx')
      }
    },
    computed: {
      ...mapState({ // 映射
        userObj: state => state.user.user
      })
    }
  }
</script>
<style lang="scss">
//noinspection CssUnknownTarget
.bg_act {
  height: 26.667rem;
  width: 100%;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.pop_wrap {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 50px;
  left: 0;
  background: rgba(0,0,0,.6);
  z-index: 100;
  .pop_content {
    box-sizing: border-box;
    background: #fff;
    width:590px;
    height:950px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -475px;
    margin-left: -295px;
    padding: 86px 52px;
    .text {
      height: 610px;
      overflow-y: scroll;
      padding-left: 12px;
      padding-top: 32px;
      margin-bottom: 60px;
      p {
        color: #000;
        font-size: 18px;
        text-align: justify;
      }
    }
    h3 {
      text-align: center;
      color: #000;
      font-size: 28px;
      border-bottom: 2px solid #000;
      padding-bottom: 24px;
    }
    .btn_wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 34px;
      span {
        display: inline-block;
        background: #00954c;
        border-radius: 20px;
        border: 2px solid #9bc143;
        width: 150px;
        height: 46px;
        line-height: 46px;
        color: #fff;
        font-size: 22.85px;
        text-align: center;
      }
    }
  }
}
</style>
<style>
  .v-modal {
    pointer-events: none;
  }
  .iconShow {
    position: fixed;
    z-index: 10001;
    bottom:40px;
    right: 28px;
    width: 152px;
    height: 189px;
  }
  img {
    width: 100%;
  }
</style>
