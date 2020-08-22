<template>
  <!--订单列表-->
  <div class="pass-container">
    <!--头部-->
    <div class="pass-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="bm-flex header-title">个人中心</div>
      <div class="header-right"></div>
    </div>

    <div class="set-password-content">
      <h4 class="set-password-title">修改密码</h4>
      <!--重置密码编辑区-->
      <div class="set-password-edit">
        <div class="edit-group bm-box bm-box-horizontal bm-box-vertical-center">
          <div class="icon">
            <i class="iconfont icon-password"></i>
          </div>
          <div class="bm-flex edit-input">
            <input v-if="oldpasswordShow" type="text" placeholder="请输入旧密码" v-model="form.oldpwd">
            <input v-else type="password" placeholder="请输入旧密码" v-model="form.oldpwd">
          </div>
          <div @click="oldpasswordShow = !oldpasswordShow" class="pwd-show">
            <i class="iconfont" :class="passwordShow? 'icon-hide':'icon-show'"></i>
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

        <!--下一步-->
        <div @click="toUpdate" class="next-step-btn">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Request from '~/plugins/request'
import congratulationsLayer from '~/components/book/layer/congratulations.vue'

export default {
  name: 'order',
  components: {
    congratulationsLayer
  },
  head() {
    return {
      title: '一汽丰田官方商城',
      meta: [ // seo
        { hid: 'keywords', name: 'keywords', content: '' },
        { hid: 'description', name: 'description', content: '' }
      ]
    }
  },
  data() {
    return {
      passwordPopupVisible: this.show,
      oldpasswordShow: false,
      passwordShow: false,
      rePasswordShow: false,
      form: {
        oldpwd: '',
        pwd: '',
        rpwd: ''
      }
    }
  },
  beforeMount() { },
  mounted() {
    let t = this
    t.$store.dispatch('publicKey')
    console.log('publicKey:>', t.publicKey)
  },
  destroyed() { },
  computed: {
    ...mapState({ // 映射
      publicKey: state => state.user.publicKey,
      userObj: state => state.user.user
    })
  },
  methods: {
    // 返回
    doBack() {
      this.$router.replace('/wx/user')
    },
    // 退出登录
    doLoginOut() {
      let t = this
      try {
        Request.logout({
          'ACCESS_TOKEN': t.userObj.data.token
        }).then(result => {
          t.$router.push('/wx')
          t.$common.clearUserInfo()
          t.$store.dispatch('doLogin', t.$common.getUnLoginData())
          t.syncLoadLayer({
            type: 'login',
            show: true
          })
        })
      } catch (e) {
        t.$common.clearUserInfo()
        t.$store.dispatch('doLogin', t.$common.getUnLoginData())
        t.syncLoadLayer({
          type: 'login',
          show: true
        })
      }
    },
    // 修改
    toUpdate() {
      let t = this
      if (!t.form.oldpwd) {
        t.$toast('请输入旧密码')
      } else if (!t.form.pwd) {
        t.$toast('请再次输入新密码')
      } else if (t.form.pwd.length < 6 || t.form.pwd.length > 20) {
        t.$toast('输入密码长度在6~20之间，必须包含字母和数字')
      } else if (!t.$util.Str.isStringNum(t.form.rpwd)) {
        t.$toast('密码只能由字母数字组成')
      } else if (!t.form.rpwd) {
        t.$toast('请再次输入确认新密码')
      } else if (t.form.pwd !== t.form.rpwd) {
        t.$toast('两次输入的密码不相同')
      } else {
        Request.updatePassword({
          ACCESS_TOKEN: t.userObj.data.token,
          mobile: t.userObj.data.mobile, // 手机号
          oldPassword: t.$common.fcmdEncrypt(t.form.oldpwd, t.publicKey.mod, t.publicKey.exp), // 密码（使用rsa加密后的密码）
          password: t.$common.fcmdEncrypt(t.form.pwd, t.publicKey.mod, t.publicKey.exp), // 密码（使用rsa加密后的密码）
          surePassword: t.$common.fcmdEncrypt(t.form.rpwd, t.publicKey.mod, t.publicKey.exp), // 密码（使用rsa加密后的密码）
          mod: t.publicKey.mod // RSA加密模数mod
        }).then(result => {
          if (result.success) {
            t.$toast('密码修改成功')
            setTimeout(() => {
              t.doLoginOut()
            }, 1000)
          } else {
            t.$toast(result.msg)
            t.$store.dispatch('publicKey') // 重新获取密钥
          }
        })
      }
    }
  },
  watch: {
  }
}
</script>
<style lang="scss">
@import "~/assets/sass/pages/user/pass.scss";
</style>
