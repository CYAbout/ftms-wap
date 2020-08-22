<template>
  <div class="sales-container">
    <iframe :src="src" frameborder="no" style="width: 100vw;height: 255.76vw;"></iframe>
  </div>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    name: 'home',
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
        src: 'https://mall.ftms.com.cn/toyoweb/index.html?phone='
      }
    },
    mounted() {
      let t = this
      if (!t.userObj.logined) {
        // 获取登录信息
        let userObj = t.$common.getUserInfo() || ''
        if (userObj === '') {
          userObj = t.$common.getUnLoginData()
        }
        if (!userObj.logined) {
          // 未登录
          t.$common.clearUserInfo()
          t.$messageBox.confirm('登录失效，是否重新登录?').then(
            action => {
              this.skipPage('homeContainerTop')
              t.syncLoadLayer({
                type: 'login',
                show: true
              })
            },
            cancel => {
              t.$common.clearUserInfo()
              t.$router.go(-1)
            }
          )
        } else {
          // 异步调用
          ; (async () => {
            try {
              var hasNameF
              t.userObj = t.$common.getUserInfo() || ''
              await t.$store.dispatch('doLogin', userObj)
              await t.$store.dispatch('getUserInfo', t.userObj.data)
              t.userObj.data['realName'] = t.userObj.data.realName || t.userObj.data.loginName || ''
              t.userObj.data['idCard'] = t.userObj.data.idCard || ''
              if (t.userObj.data.realName !== '') {
                hasNameF = true
              } else {
                hasNameF = false
              }
              t.form = {
                name: t.userObj.data.realName || '',
                phone: t.userObj.data.mobile || '',
                idCardNo: t.userObj.data.idCard || '',
                hasCardNo: t.userObj.data.idCard !== '',
                hasName: hasNameF,
                realName: t.userObj.data.realName || '',
                idCard: t.userObj.data.idCard || ''
              }
              t.src = 'https://mall.ftms.com.cn/toyoweb/index.html?phone=' + t.userObj.data.mobile
            } catch (error) {
              console.log(error)
            }
          })()
        }
      } else {
        (async () => {
          try {
            var hasNameF
            t.userObj = t.$common.getUserInfo() || ''
            await t.$store.dispatch('getUserInfo', t.userObj.data)
            t.userObj.data['realName'] = t.userObj.data.realName || ''
            t.userObj.data['idCard'] = t.userObj.data.idCard || ''
            if (t.userObj.data.realName !== '') {
              hasNameF = true
            } else {
              hasNameF = false
            }
            t.form = {
              name: t.userObj.data.realName || '',
              phone: t.userObj.data.mobile || '',
              idCardNo: t.userObj.data.idCard || '',
              hasCardNo: t.userObj.data.idCard !== '',
              hasName: hasNameF,
              realName: t.userObj.data.realName || '',
              idCard: t.userObj.data.idCard || ''
            }
            t.src = 'https://mall.ftms.com.cn/toyoweb/index.html?phone=' + t.userObj.data.mobile
          } catch (error) {
            console.log(error)
          }
        })()
      }
    },
    methods: {
      // 跳转
      skipPage(id) {
        let t = this
        window.location.hash = '#' + id
        setTimeout(() => { // 清除hash
          t.$router.replace('')
        }, 600)
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
</style>
<style>
  .v-modal {
    pointer-events: none;
  }
</style>


