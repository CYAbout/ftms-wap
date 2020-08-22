import Util from '~/plugins/util.js'
import Request from '~/plugins/request'
import Vue from 'vue'

export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    if (process.client) {
      const token = Util.Params.GetArgsFromHref(window.location.href, 'token')
      console.log('token', token)
      if (token) {
        // 查询用户信息
        Request.getMemberInfo({
          'ACCESS_TOKEN': token || ''
        }).then(result => {
          if (result.success) {
            let userObj = {
              logined: true,
              data: {}
            }
            let obj = result.data || {}
            userObj.data['birthday'] = obj.birthday || ''
            userObj.data['loginName'] = obj.loginName || ''
            userObj.data['memberId'] = obj.memberId || obj.memberId || ''
            userObj.data['memberLogo'] = obj.memberLogo || ''
            userObj.data['mobile'] = obj.mobile || ''
            userObj.data['realName'] = obj.realName || ''
            userObj.data['sex'] = obj.sex || ''
            userObj.data['idCard'] = obj.idCard || ''
            userObj.data['token'] = token
            if (!userObj.data.mobile) {
              next('/wx/login')
            } else {
              (async () => {
                Vue.prototype.$common.saveUserInfo(userObj)
                // await app.store.dispatch('doLogin', loginObj)
                app.store.commit('user/USER_GET_DATA', userObj)
                next()
              })()
            }
          }
        })
      } else {
        console.log('next=-==========')
        next()
      }
    }
  })
}
