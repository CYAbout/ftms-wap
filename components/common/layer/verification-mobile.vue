<template>
  <!--验证手机号-->
  <mt-popup
    class="verification-mobile-layer"
    v-model="verificationPopupVisible"
    popup-transition="popup-fade">
    <div class="verification-content">
      <h4 class="verification-title">忘记密码</h4>
      <!--验证编辑-->
      <div class="verification-edit">
        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon"><i class="iconfont icon-phone"></i></div>
          <div class="bm-flex edit-input">
            <input placeholder="请输入手机号码" maxlength="11" v-model="form.phone" @input="phoneChange"/>
          </div>
        </div>

        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon"><i class="iconfont icon-message"></i></div>
          <div class="bm-flex edit-input">
            <input placeholder="请输入手机验证码" v-model="form.code"/>
          </div>
          <div @click="getSmsCode" class="code-btn" :class="smsCodeOption.canDoSend? 'active':''">
            {{smsCodeOption.btnText}}
          </div>
        </div>

        <!--下一步-->
        <div @click="toNextStep" class="next-step-btn">下一步</div>
      </div>

    </div>
    <!--关闭按钮-->
    <div @click="goBack" class="close-btn"><i class="iconfont icon-guanbi"></i></div>
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
        verificationPopupVisible: this.show,
        passwordShow: false,
        smsCodeOption: {
          btnText: '获取验证码',
          canDoSend: false
        },
        form: {
          phone: '',
          code: ''
        }
      }
    },
    destroyed () {
      let t = this
      if (t.timeId) {
        clearTimeout(t.timeId)
        t.timeId = null
      }
    },
    methods: {
      goBack() {
        this.verificationPopupVisible = false
        const href = window.location.href
        if (href.indexOf('/yhctActPage') >= 0) {
          this.$router.replace('/wx')
        }
      },
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
              sendCodeType: 'FINDPASSWORD_'
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
      // 下一步
      toNextStep () {
        let t = this
        if (!t.form.phone) {
          t.$toast('请输入手机号码')
        } else if (t.form.phone && !t.$util.Str.isMobilePhoneNum(t.form.phone)) {
          t.$toast('您输入的手机号有误，请输入正确的手机号')
        } else if (!t.form.code) {
          t.$toast('请输入手机验证码')
        } else {
          // 验证手机验证码
          Request.findPasswordCheck({
            mobile: t.form.phone, // 手机号
            mobileVerificationCode: t.form.code // 手机号验证码
          }).then(resultObj => {
            if (resultObj.success) {
              this.$emit('close', {
                type: 'password',
                show: true,
                form: t.form
              })
            } else {
              t.$toast(resultObj.msg)
            }
          })
        }
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.verificationPopupVisible = val
      },
      verificationPopupVisible (val) {
        if (!val) {
          this.$emit('close', {
            type: 'verification',
            show: val
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/verification-mobile';
</style>
