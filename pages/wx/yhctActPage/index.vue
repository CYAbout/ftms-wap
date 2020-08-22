<template>
  <div class="sales-container">
    <iframe :src="src" frameborder="no" style="width: 100vw;height: 883.0667vw;"></iframe>
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
        iconShow: false,
        groupid: '',
        src: 'https://ftms.test511.com/index.html?mobile='
      }
    },
    mounted() {
      this.groupid = window.localStorage.getItem('groupid') ? window.localStorage.getItem('groupid') : ''
      this.getActivityState()
      let t = this
      if (!t.userObj.logined) {
        // t.$router.push('/wx')
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
              t.src = 'https://ftms.test511.com/index.html?mobile=' + t.userObj.data.mobile + '&token=' + t.userObj.data.token + '&orderChannel=' + this.groupid
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
            console.log(t.userObj.data.mobile, t.userObj.data.token, this.groupid)
            t.src = 'https://ftms.test511.com/index.html?mobile=' + t.userObj.data.mobile + '&token=' + t.userObj.data.token + '&orderChannel=' + this.groupid
          } catch (error) {
            console.log(error)
          }
        })()
      }
      window.addEventListener('message', function(e) {
        if (e) {
          document.documentElement.scrollTop = document.body.scrollTop = 0
        }
      }, false)
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


