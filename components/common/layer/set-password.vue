<template>
  <!--设置密码-->
  <mt-popup
    class="set-password-layer"
    v-model="passwordPopupVisible"
    popup-transition="popup-fade">
    <div class="set-password-content">
      <h4 class="set-password-title">忘记密码</h4>
      <!--重置密码编辑区-->
      <div class="set-password-edit">
        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon"><i class="iconfont icon-password"></i></div>
          <div class="bm-flex edit-input">
            <input v-if="passwordShow" type="text" placeholder="请输入6-20位数字和字母的组合" v-model="form.pwd"/>
            <input v-else type="password" placeholder="请输入6-20位数字和字母的组合" v-model="form.pwd"/>
          </div>
          <div @click="passwordShow = !passwordShow" class="pwd-show">
            <i class="iconfont" :class="passwordShow? 'icon-hide':'icon-show'"></i>
          </div>
        </div>

        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon"><i class="iconfont icon-confirm-password"></i></div>
          <div class="bm-flex edit-input">
            <input v-if="rePasswordShow" type="text" placeholder="请再次输入确认新密码" v-model="form.rpwd"/>
            <input v-else type="password" placeholder="请再次输入确认新密码" v-model="form.rpwd"/>
          </div>
          <div @click="rePasswordShow = !rePasswordShow" class="pwd-show">
            <i class="iconfont" :class="rePasswordShow? 'icon-hide':'icon-show'"></i>
          </div>
        </div>

        <!--下一步-->
        <div @click="toNextStep" class="next-step-btn">下一步</div>
      </div>

    </div>
    <!--关闭按钮-->
    <div @click="passwordPopupVisible = false" class="close-btn"><i class="iconfont icon-guanbi"></i></div>
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
            code: ''
          }
        }
      }
    },
    data () {
      return {
        passwordPopupVisible: this.show,
        passwordShow: false,
        rePasswordShow: false,
        form: {
          pwd: '',
          rpwd: ''
        }
      }
    },
    mounted () {
      let t = this
      t.$store.dispatch('publicKey')
      // console.log('publicKey:>', t.publicKey)
    },
    computed: {
      ...mapState({ // 映射
        publicKey: state => state.user.publicKey
      })
    },
    methods: {
      // 下一步
      toNextStep () {
        let t = this
        if (!t.form.pwd) {
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
          Request.findPassword({
            mobile: t.options.phone, // 手机号
            mobileVerificationCode: t.options.code, // 手机短信验证码
            password: t.$common.fcmdEncrypt(t.form.pwd, t.publicKey.mod, t.publicKey.exp), // 密码（使用rsa加密后的密码）
            surePassword: t.$common.fcmdEncrypt(t.form.rpwd, t.publicKey.mod, t.publicKey.exp), // 密码（使用rsa加密后的密码）
            mod: t.publicKey.mod // RSA加密模数mod
          }).then(result => {
            // console.log('result:>', result)
            if (result.success) {
              let obj = result.data || {}
              console.log('obj:>', obj)
              t.$emit('close', {
                type: 'success',
                show: true
              })
            } else {
              t.$toast(result.msg)
              t.$store.dispatch('publicKey') // 重新获取密钥
            }
          })
        }
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.passwordPopupVisible = val
      },
      passwordPopupVisible (val) {
        if (!val) {
          this.$emit('close', {
            type: 'password',
            show: val
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/set-password';
</style>
