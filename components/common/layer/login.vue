<template>
  <!--登录-->
  <mt-popup class="login-layer" v-model="loginPopupVisible" popup-transition="popup-fade">
    <div class="login-content">
      <h4 class="login-title">登录</h4>
      <div class="login-tab bm-box bm-box-horizontal bm-box-vertical-center">
        <div
          @click="loginType = 'quick'"
          class="bm-flex"
          :class="loginType==='quick'? 'active':''"
        >快捷登录</div>
        <div
          @click="loginType = 'account'"
          class="bm-flex"
          :class="loginType==='account'? 'active':''"
        >账号登录</div>
      </div>
      <!--快捷登录-->
      <div v-if="loginType === 'quick'" class="quick-login">
        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon">
            <i class="iconfont icon-phone"></i>
          </div>
          <div class="bm-flex edit-input">
            <input placeholder="请输入手机号码" maxlength="11" v-model="form.phone" @input="phoneChange">
          </div>
        </div>

        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon">
            <i class="iconfont icon-message"></i>
          </div>
          <div class="bm-flex edit-input">
            <input placeholder="请输入手机验证码" v-model="form.code">
          </div>
          <div
            @click="getSmsCode"
            class="code-btn"
            :class="smsCodeOption.canDoSend? 'active':''"
          >{{smsCodeOption.btnText}}</div>
        </div>

        <!--登录按钮-->
        <div @click="doLogin" class="do-login">登录</div>
      </div>
      <!--账号登录-->
      <div v-else class="account-login">
        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon">
            <i class="iconfont icon-phone"></i>
          </div>
          <div class="bm-flex edit-input">
            <input placeholder="请输入手机号码" maxlength="11" v-model="form.phone" @input="phoneChange">
          </div>
        </div>

        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon">
            <i class="iconfont icon-password"></i>
          </div>
          <div class="bm-flex edit-input">
            <input
              v-if="passwordShow"
              type="text"
              placeholder="请输入密码(6-20位数字和字母的组合)"
              v-model="form.password"
            >
            <input
              v-else
              type="password"
              placeholder="请输入密码(6-20位数字和字母的组合)"
              v-model="form.password"
            >
          </div>
          <div @click="passwordShow = !passwordShow" class="pwd-show">
            <i class="iconfont" :class="passwordShow? 'icon-hide':'icon-show'"></i>
          </div>
        </div>

        <div @click="forgetPwd" class="forget-pwd">忘记密码？</div>

        <!--登录按钮-->
        <div @click="doLogin" class="do-login">登录</div>
      </div>

      <!--提示-->
      <div class="login-tip">
        如果您还没有账号，请
        <span @click="toRegister">注册</span>
      </div>
    </div>
    <!--关闭按钮-->
    <div @click="doClose" class="close-btn">
      <i class="iconfont icon-guanbi"></i>
    </div>
  </mt-popup>
</template>

<script>
import { mapState } from 'vuex'
import Request from '~/plugins/request.js'

export default {
  props: {
    'show': {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      oHeight: document.documentElement.clientHeight, // 解决xs微信登录兼容问题
      timeId: null,
      loginPopupVisible: this.show,
      loginType: 'quick', // quick | account
      passwordShow: false,
      smsCodeOption: {
        btnText: '获取验证码',
        canDoSend: false
      },
      form: {
        phone: '',
        code: '',
        password: ''
      }
    }
  },
  mounted() {
    let t = this
    t.uniqueUserId = t.$cache.uniqueUserId.get() || ''
    t.origin = t.$cache.origin.get() || ''
    // window.onresize = () => {
    //   return (() => {
    //     if (this.oHeight > document.documentElement.clientHeight) {
    //       document.getElementsByClassName('mint-popup login-layer')[0].className = 'mint-popup login-layer login-layer2'
    //     } else {
    //       document.getElementsByClassName('mint-popup login-layer login-layer2')[0].className = 'mint-popup login-layer'
    //     }
    //   })()
    // }
  },
  destroyed() {
    let t = this
    if (t.timeId) {
      clearTimeout(t.timeId)
      t.timeId = null
    }
  },
  computed: {
    ...mapState({ // 映射
      publicKey: state => state.user.publicKey,
      userCode: state => state.user.userCode
    })
  },
  methods: {
    // 倒计时
    _countdown(num) {
      let t = this
      t.smsCodeOption.btnText = '(' + num + 's)后重新获取'
      t.smsCodeOption.canDoSend = false
      if (num > 0) {
        (function (fn) {
          t.timeId = setTimeout(function () {
            fn(num - 1)
          }, 1000)
        })(t._countdown)
      } else {
        clearTimeout(t.timeId)
        t.timeId = null
        t.smsCodeOption.btnText = '重新获取'
        t.smsCodeOption.canDoSend = true
      }
    },
    // 获取手机验证码
    getSmsCode() {
      let t = this
      if (!t.form.phone) {
        t.$toast('请输入手机号码')
      } else if (t.form.phone && !t.$util.Str.isMobilePhoneNum(t.form.phone)) {
        t.$toast('您输入的手机号有误，请输入正确的手机号~')
      } else {
        if (t.smsCodeOption.canDoSend) {
          Request.sendMobileCode({
            mobile: t.form.phone,
            sendCodeType: 'LOGIN_'
          }).then((result) => {
            if (result.success) {
              t.$toast('短信验证码发送成功，请注意查收~')
              // 倒计时
              t._countdown(60)
            } else {
              t.$toast(result.msg)
            }
          })
        }
      }
    },
    // 输入手机号码改变，输入正确时验证手机号是否已注册
    phoneChange() {
      let t = this
      t.smsCodeOption.canDoSend = false
      if (t.form.phone && t.form.phone.length > 11) {
        t.$toast('手机号输入有误，请重新输入~')
      } else if (t.form.phone && t.form.phone.length === 11) {
        if (!t.$util.Str.isMobilePhoneNum(t.form.phone)) {
          t.$toast('您输入的手机号有误，请输入正确的手机号~')
        } else {
          t.smsCodeOption.canDoSend = true
        }
      }
    },
    // 登录
    doLogin() {
      let t = this
      // console.log('---login---')
      if (t.loginType === 'quick') { // 快捷登录
        if (!t.form.phone) {
          t.$toast('请输入手机号码')
        } else if (t.form.phone && !t.$util.Str.isMobilePhoneNum(t.form.phone)) {
          t.$toast('您输入的手机号有误，请输入正确的手机号')
        } else if (!t.form.code) {
          t.$toast('请输入手机验证码')
        } else {
          // console.log('publicKey:>', t.publicKey)
          Request.login({
            mobile: t.form.phone,
            mobileVerificationCode: t.form.code,
            loginWay: '0'
          }).then(result => {
            // console.log('result:>', result)
            if (result.success) {
              if (t.uniqueUserId) {
                Request.saveProtectGuestReqInfo({
                  mobile: result.data.mobile,
                  uniqueUserId: t.uniqueUserId,
                  type: '01',
                  typeDes: '登录',
                  sourceChannel: t.origin
                }).then(result => {
                  // console.log('result:>', result)
                })
              }
              let obj = result.data || {}
              // console.log('obj:>', obj)
              console.log(obj, obj.accessToken)
              let loginObj = {
                logined: true,
                data: {
                  loginName: obj.loginName || '',
                  memberId: obj.memberId || '',
                  mobile: obj.mobile || '',
                  token: obj.accessToken || obj.token || '',
                  realName: obj.realName || '',
                  idCard: obj.idCard || '',
                  memberLogo: obj.memberLogo || ''
                }
              }
              console.log('aaaa', loginObj)
              t.$common.saveUserInfo(loginObj)
              t.$store.dispatch('doLogin', loginObj)
              t.$toast(result.msg || '登录成功')
              t.loginPopupVisible = false // 关闭弹出层
              const href = window.location.href
              if (href.indexOf('/lucky') >= 0 || href.indexOf('/luckdraw') >= 0 || href.indexOf('/yhctActPage') >= 0 || href.indexOf('/activityMay') >= 0) {
                window.location.reload()
              }
              const urlForSplit = window.location.href.split('/')
              if (urlForSplit[urlForSplit.length - 2] === 'order' && urlForSplit[urlForSplit.length - 1] === 'all') {
                window.location.reload()
              }
            } else {
              t.$toast(result.msg)
            }
          })
        }
      } else {
        // if (t.form.password.length < 6 || t.form.password.length > 20) {
        //   t.$toast('输入密码长度在6~20之间，必须包含字母和数字')
        // } else if (!t.$util.Str.isStringNum(t.form.password)) {
        //   t.$toast('密码只能由字母数字组成')
        // }
        if (!t.form.phone) {
          t.$toast('请输入手机号码')
        } else if (t.form.phone && !t.$util.Str.isMobilePhoneNum(t.form.phone)) {
          t.$toast('您输入的手机号有误，请输入正确的手机号')
        } else if (!t.form.password) {
          t.$toast('请输入密码')
        } else {
          Request.login({
            mobile: t.form.phone,
            password: t.$common.fcmdEncrypt(t.form.password, t.publicKey.mod, t.publicKey.exp),
            mod: t.publicKey.mod,
            loginWay: '1'
          }).then(result => {
            // console.log('result:>', result)
            if (result.success) {
              if (t.uniqueUserId) {
                Request.saveProtectGuestReqInfo({
                  mobile: result.data.mobile,
                  uniqueUserId: t.uniqueUserId,
                  type: '01',
                  typeDes: '登录',
                  sourceChannel: t.origin
                }).then(result => {
                  // console.log('result:>', result)
                })
              }
              let obj = result.data || {}
              // console.log('obj:>', obj)
              let loginObj = {
                logined: true,
                data: {
                  loginName: obj.loginName || '',
                  memberId: obj.memberId || '',
                  mobile: obj.mobile || '',
                  token: obj.accessToken || obj.token || '',
                  realName: obj.realName || '',
                  idCard: obj.idCard || '',
                  memberLogo: obj.memberLogo || ''
                }
              }
              t.$common.saveUserInfo(loginObj) // 存储用户信息
              t.$store.dispatch('doLogin', loginObj)
              t.$toast(result.msg || '登录成功')
              t.loginPopupVisible = false // 关闭弹出层
              const href = window.location.href
              if (href.indexOf('/lucky') >= 0 || href.indexOf('/luckdraw') >= 0 || href.indexOf('/yhctActPage') >= 0 || href.indexOf('/activityMay') >= 0) {
                window.location.reload()
              }
              const urlForSplit = window.location.href.split('/')
              if (urlForSplit[urlForSplit.length - 2] === 'order' && urlForSplit[urlForSplit.length - 1] === 'all') {
                window.location.reload()
              }
            } else {
              t.$toast(result.msg)
              t.$store.dispatch('publicKey') // 重新获取密钥
            }
          })
        }
      }
    },
    // 去注册
    toRegister() {
      this.$emit('close', {
        type: 'register',
        show: true
      })
    },
    // 忘记密码
    forgetPwd() {
      this.$emit('close', {
        type: 'verification',
        show: true
      })
    },
    doClose() {
      let t = this
      t.loginPopupVisible = false
      const href = window.location.href
      if (href.indexOf('/lucky') >= 0 || href.indexOf('/luckdraw') >= 0 || href.indexOf('/yhctActPage') >= 0 || href.indexOf('/activityMay') >= 0) {
        t.$router.replace('/wx')
      }
    }
  },
  watch: {
    // 监听show改变
    show(val) {
      this.loginPopupVisible = val
    },
    loginPopupVisible(val) {
      let t = this
      if (!val) {
        t.$emit('close', {
          type: 'login',
          show: val
        })
      }
    },
    // 登录类型
    loginType(flag) {
      if (flag === 'account') {
        this.$store.dispatch('publicKey')
      }
    }
  }
}
</script>
<style lang="scss">
@import "./sass/login";
</style>
