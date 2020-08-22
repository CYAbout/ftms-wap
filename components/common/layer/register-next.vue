<template>
  <!--注册-->
  <mt-popup
    class="register-layer register-next-layer"
    v-model="registerPopupVisible"
    popup-transition="popup-fade"
  >
    <div class="register-content">
      <h4 class="register-title">注册</h4>
      <!--注册-->
      <div class="register-group">
        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon">
            <i class="iconfont icon-name"></i>
          </div>
          <div class="bm-flex edit-input">
            <input type="text" placeholder="请输入一个登录名" v-model="form.name">
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
              placeholder="请输入6-20位数字和字母的组合"
              v-model="form.pwd"
            >
            <input v-else type="password" placeholder="请输入6-20位数字和字母的组合" v-model="form.pwd">
          </div>
          <div @click="passwordShow = !passwordShow" class="pwd-show">
            <i class="iconfont" :class="passwordShow? 'icon-hide':'icon-show'"></i>
          </div>
        </div>

        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon">
            <i class="iconfont icon-confirm-password"></i>
          </div>
          <div class="bm-flex edit-input">
            <input v-if="rePasswordShow" type="text" placeholder="请再次输入确认新密码" v-model="form.rpwd">
            <input v-else type="password" placeholder="请再次输入确认新密码" v-model="form.rpwd">
          </div>
          <div @click="rePasswordShow = !rePasswordShow" class="pwd-show">
            <i class="iconfont" :class="rePasswordShow? 'icon-hide':'icon-show'"></i>
          </div>
        </div>

        <!--登录按钮-->
        <div @click="doSubmit" class="do-register">注册</div>
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
    },
    'options': {
      type: Object,
      default: () => {
        return {
          phone: '',
          picCode: '',
          phoneCode: '',
          checked: false
        }
      }
    }
  },
  data() {
    return {
      registerPopupVisible: this.show,
      passwordShow: false,
      rePasswordShow: false,
      form: {
        name: '',
        pwd: '',
        rpwd: ''
      }
    }
  },
  mounted() {
    let t = this
    t.$store.dispatch('publicKey')
    t.uniqueUserId = t.$cache.uniqueUserId.get() || ''
    t.origin = t.$cache.origin.get() || ''
    // console.log('publicKey:>', t.publicKey)
  },
  computed: {
    ...mapState({ // 映射
      publicKey: state => state.user.publicKey,
      userCode: state => state.user.userCode
    })
  },
  methods: {
    // 去注册
    doSubmit() {
      let t = this
      if (!t.form.name) {
        t.$toast('请输入一个登录名')
      } else if (!t.form.pwd) {
        t.$toast('请输入密码')
      } else if (t.form.pwd.length < 6 || t.form.pwd.length > 20) {
        t.$toast('输入密码长度在6~20之间，必须包含字母和数字')
      } else if (!t.$util.Str.isStringNum(t.form.pwd)) {
        t.$toast('密码只能由字母数字组成')
      } else if (!t.form.rpwd) {
        t.$toast('请再次输入确认新密码')
      } else if (t.form.pwd !== t.form.rpwd) {
        t.$toast('两次输入的密码不相同')
      } else {
        Request.register({
          loginName: t.form.name,
          mobile: t.options.phone, // 手机号
          verificationCode: t.options.picCode, // 图片验证码
          mobileVerificationCode: t.options.phoneCode, // 手机短信验证码
          password: t.$common.fcmdEncrypt(t.form.pwd, t.publicKey.mod, t.publicKey.exp), // 密码（使用rsa加密后的密码）
          surePassword: t.$common.fcmdEncrypt(t.form.rpwd, t.publicKey.mod, t.publicKey.exp), // 密码（使用rsa加密后的密码）
          mod: t.publicKey.mod // RSA加密模数mod
        }).then(result => {
          // console.log('result:>', result)
          if (result.success) {
            if (t.uniqueUserId) {
              Request.saveProtectGuestReqInfo({
                mobile: result.data.mobile,
                uniqueUserId: t.uniqueUserId,
                type: '00',
                typeDes: '注册',
                sourceChannel: t.origin
              }).then(result => {
                // console.log('result:>', result)
              })
            }
            let obj = result.data || {}
            // console.log('obj:>', obj)
            // 注册成功后直接登录
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
            t.$common.saveUserInfo(loginObj)
            t.$store.dispatch('doLogin', loginObj)
            t.$toast(result.msg || '登录成功')
            this.$emit('close', {
              type: 'register-next',
              show: false
            })
            const href = window.location.href
            if (href.indexOf('/lucky') >= 0 || href.indexOf('/luckdraw') >= 0 || href.indexOf('/yhctActPage') >= 0 || href.indexOf('/activityMay') >= 0) {
              window.location.reload()
            }
            // t.$messageBox.confirm('注册成功，是否去登录?').then(action => {
            //   // console.log('action:>', action)
            //   t.$emit('close', {
            //     type: 'login',
            //     show: true
            //   })
            // }, cancel => {
            //   t.registerPopupVisible = false
            // })
          } else {
            t.$toast(result.msg)
            t.$store.dispatch('publicKey') // 重新获取密钥
          }
        })
      }
    },
    doClose() {
      let t = this
      t.registerPopupVisible = false
      const href = window.location.href
      if (href.indexOf('/lucky' || href.indexOf('/luckdraw') >= 0 || href.indexOf('/yhctActPage') >= 0) >= 0 || href.indexOf('/activityMay') >= 0) {
        t.$router.replace('/wx')
      }
    }
  },
  watch: {
    // 监听show改变
    show(val) {
      this.registerPopupVisible = val
    },
    registerPopupVisible(val) {
      if (!val) {
        this.$emit('close', {
          type: 'register-next',
          show: val
        })
      }
    }
  }
}
</script>
<style lang="scss">
@import "./sass/register";
</style>
