<template>
  <!--注册-->
  <mt-popup
    class="register-layer"
    v-model="registerPopupVisible"
    popup-transition="popup-fade">
    <div class="register-content">
      <h4 class="register-title">注册</h4>
      <!--注册-->
      <div class="register-group">
        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon"><i class="iconfont icon-phone"></i></div>
          <div class="bm-flex edit-input">
            <input placeholder="请输入手机号码" maxlength="11" v-model="form.phone" @input="phoneChange"/>
          </div>
        </div>

        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon"><i class="iconfont icon-code"></i></div>
          <div class="bm-flex edit-input">
            <input placeholder="请输入验证码" v-model="form.picCode"/>
          </div>
          <img @click="getImageCode" class="pic-code" :src="codePic"/>
        </div>

        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon"><i class="iconfont icon-message"></i></div>
          <div class="bm-flex edit-input">
            <input placeholder="请输入手机验证码" v-model="form.phoneCode"/>
          </div>
          <div @click="getSmsCode" class="code-btn" :class="smsCodeOption.canDoSend? 'active':''">
            {{smsCodeOption.btnText}}
          </div>
        </div>

        <div class="agreement-check">
          <span @click="form.checked = !form.checked" :class="form.checked? 'active':''">
            <i class="iconfont" :class="form.checked? 'icon-check-full':'icon-check-empty'"></i>
            我已阅读并同意
          </span>
          <span class="agreement" @click="toViewAgreement">用户注册&商城服务</span>
          <span> 协议</span>
        </div>

        <!--登录按钮-->
        <div @click="doSubmit" class="do-register">下一步</div>
      </div>

      <!--提示-->
      <div class="login-tip">如果您已有账号，请<span @click="toLogin">登录</span></div>
    </div>
    <!--关闭按钮-->
    <div @click="doClose" class="close-btn"><i class="iconfont icon-guanbi"></i></div>
  </mt-popup>
</template>

<script>
  import Request from '~/plugins/request.js'

  export default {
    props: {
      'show': {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        timeId: null,
        registerPopupVisible: this.show,
        registerType: 'quick', // quick | account
        passwordShow: false,
        codePic: '',
        codeKey: '',
        smsCodeOption: {
          btnText: '获取验证码',
          canDoSend: false
        },
        form: {
          phone: '',
          picCode: '',
          phoneCode: '',
          checked: false
        }
      }
    },
    mounted () {
      let t = this
      let register = t.$cache.register.get()
      if (register) {
        register = t.$util.Str.strToJson(register)
        t.form.phone = register.phone || ''
        t.form.picCode = register.picCode || ''
        t.form.phoneCode = register.phoneCode || ''
        t.form.checked = register.checked || false
      }
      this.getImageCode()
    },
    destroyed () {
      let t = this
      if (t.timeId) {
        clearTimeout(t.timeId)
        t.timeId = null
      }
    },
    methods: {
      // 倒计时
      _countdown (num) {
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
      getSmsCode () {
        let t = this
        if (!t.form.phone) {
          t.$toast('请输入手机号码')
        } else if (t.form.phone && !t.$util.Str.isMobilePhoneNum(t.form.phone)) {
          t.$toast('您输入的手机号有误，请输入正确的手机号~')
        } else {
          if (t.smsCodeOption.canDoSend) {
            Request.sendMobileCode({
              mobile: t.form.phone,
              sendCodeType: 'REGISTER_'
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
      phoneChange () {
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
      // 获取图形验证码
      getImageCode () {
        let t = this
        Request.getImageCode().then(result => {
          if (result.success) {
            t.codePic = result.data
            t.codeKey = result.codeKey
          }
        })
      },
      // 注册
      doSubmit () {
        let t = this
        if (!t.form.phone) {
          t.$toast('请输入手机号码')
        } else if (t.form.phone && !t.$util.Str.isMobilePhoneNum(t.form.phone)) {
          t.$toast('您输入的手机号有误，请输入正确的手机号')
        } else if (!t.form.picCode) {
          t.$toast('请输入验证码')
        } else if (!t.form.phoneCode) {
          t.$toast('请输入手机验证码')
        } else if (!t.form.checked) {
          // t.$toast({
          //   message: '请阅读并同意《一汽丰田电商用户注册协议》',
          //   position: 'center',
          //   duration: 500000
          // })
          t.$toast('请阅读并同意《一汽丰田电商用户注册协议》')
        } else {
          Request.checkImageCode({
            CODE_KEY: t.codeKey,
            codeKey: t.codeKey,
            signcode: t.form.picCode
          }).then(result => {
            if (result.success) {
              let obj = result.data || {}
              console.log('obj:>', obj)

              // 验证手机验证码
              Request.registerCheck({
                mobile: t.form.phone, // 手机号
                mobileVerificationCode: t.form.phoneCode // 手机号验证码
              }).then(resultObj => {
                if (resultObj.success) {
                  t.$cache.register.clear() // 清空数据
                  t.$emit('close', {
                    type: 'register-next',
                    show: true,
                    form: t.form
                  })
                } else {
                  t.$toast(resultObj.msg)
                }
              })
            } else {
              t.$toast(result.msg)
            }
          })
        }
      },
      // 查看协议
      toViewAgreement () {
        let t = this
        t.$cache.register.set(t.$util.Str.jsonToStr(t.form))
        t.$emit('close', {
          type: 'agreement',
          show: true
        })
      },
      // 去登录
      toLogin () {
        this.$emit('close', {
          type: 'login',
          show: true
        })
      },
      doClose () {
        let t = this
        t.registerPopupVisible = false
        const href = window.location.href
        if (href.indexOf('/lucky') >= 0 || href.indexOf('/luckdraw') >= 0 || href.indexOf('/yhctActPage') >= 0 || href.indexOf('/activityMay') >= 0) {
          t.$router.replace('/wx')
        }
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.registerPopupVisible = val
      },
      registerPopupVisible (val) {
        if (!val) {
          this.$emit('close', {
            type: 'register',
            show: val
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/register';
</style>
