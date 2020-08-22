<template>
  <!--帮助中心详情页-->
  <div class="help-details-container">
    <!--头部-->
    <div class="help-details-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left"><i class="iconfont icon-back"></i></div>
      <div class="bm-flex header-title">常见问题</div>
      <div class="header-right"></div>
    </div>

    <!--内容区-->
    <div class="help-details-content">
      <div class="handleProblem">
        <h1>一汽丰田官方商城常见问题</h1>
        <div>
          <div class="headerPro"><h2>登录问题</h2></div>

          <div>
            <h3>Q：一汽丰田官方商城浏览有什么要求？</h3>
            <p>答：一汽丰田官方商城适合目前主流操作系统及谷歌、IE（8+）、360、火狐、遨游等主流浏览器，为获得最佳浏览体验，请使用Internet Explorer
              11+,谷歌（Chrome），火狐浏览器（Firefox)及其它更新的浏览器。</p>
          </div>
          <div>
            <h3>Q：如何登录？</h3>
            <p>答：点击首页右上角-登录-即可使用手机号码及验证码完成登录。</p>
          </div>
          <div>
            <h3>Q：如何注册？</h3>
            <p>答：点击注册按钮，输入帐户名和密码完成注册；或通过手机号码快速注册，完成登录。</p>
          </div>
          <div>
            <h3>Q：如何找回登录密码？</h3>
            <p>答：点击登录--账户登录--忘记密码，按操作提示通过注册手机号重置登录密码。</p>
          </div>
          <div>
            <h3>Q：如何修改登录密码？</h3>
            <p>答：登录商城后，进入“个人中心”，选择修改密码，输入原密码和新密码后，即修改完成。</p>
          </div>
          <div class="headerPro"><h2>订单问题</h2></div>
          <div>
            <h3>Q：如何查询订单状态？</h3>
            <p>答：答：登录商城后，进入“个人中心”，点击“订单列表“，在所有订单列表中，可以直接查看到订单状态信息。</p>
            <img class="num1" src="~/assets/images/help_details/41.414eb069.png"/>
          </div>
          <div>
            <h3>Q：如何取消订单？</h3>
            <p>答：打开“订单列表”，选择订单，点击“订单详情”，在订单详情页面中，点击“取消订单”即可。</p>
          </div>
          <div>
            <h3>Q：如何注册？</h3>
            <p>答：点击注册按钮，输入帐户名和密码完成注册；或通过手机号码快速注册，完成登录。</p>
          </div>
          <div class="headerPro"><h2>支付问题</h2></div>
          <div>
            <h3>Q：购买商品都支持哪些支付方式？</h3>
            <p>答：目前商城购买支付支持微信，支付宝及网银支付。更多支付方式敬请期待。</p>
          </div>
          <div>
            <h3>Q：预定商品后，如何支付？</h3>
            <p>答：选择预购信息后，在订单信息中，点击“立即支付”，通过您合适的支付方式，完成付款。</p>
            <img class="num2" src="~/assets/images/help_details/31.ba91f50b.png"/></div>
          <div class="headerPro"><h2>退款问题</h2></div>
          <div>
            <h3>Q：购买商品，可以申请退款吗？退款周期多久？</h3>
            <p>答：您可以在与经销商签订订车、购车相关合同协议之前，随时提交退款申请。经销商将在3个工作日完成退款审核，如审核通过，将原路返回意向金至您的支付账户，具体到账情况以第三方支付平台及银行规定为准。</p>
          </div>
          <div>
            <h3>Q：支付订金后，如何申请退款？</h3>
            <p>答：打开 “订单详情”，点击“申请退款”，请填写申请退款原因，以便后台审核人员快速完成退款审核。</p>
            <img class="num3" src="~/assets/images/help_details/11.f9876014.png"/>
            <img class="num4" src="~/assets/images/help_details/21.4c556246.png"/>
          </div>
          <div>
            <h3>Q：退款进度如何查看？</h3>
            <p class="last">答：打开“个人中心”，点击“我的退款”，即可查看退款状态，及时了解退款进度。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'problem',
    head () {
      return {
        title: '一汽丰田官方商城',
        meta: [ // seo
          {hid: 'keywords', name: 'keywords', content: ''},
          {hid: 'description', name: 'description', content: ''}
        ]
      }
    },
    methods: {
      // 返回
      doBack () {
        this.$router.replace('/wx/help')
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/assets/sass/pages/help/details.scss';
</style>
