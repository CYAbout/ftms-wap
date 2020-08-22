<template>
  <div class="sales-container">
    <iframe id="abc" :src="src" frameborder="no" style="width: 100vw;height: 223.07vw;"></iframe>
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
        src: 'https://520activity.test511.com/index.html'
      }
    },
    mounted() {
      let t = this
      // 将get请求？后的数据处理成json
      var _param = this.querryStringToObject(window.location.search)
      console.log('1data:', t.userObj.data)
      console.log('win:', window.location.search)
      console.log('_param:', _param)
      var _data = ''
      _data += 'loginphone=' + (t.userObj.data.mobile || '')
      _data += '&token=' + (t.userObj.data.token || '')
      _data += '&orderChannel=' + (_param.groupid || '')
      _data += '&invphone=' + (_param.invphone || '')
      _data += '&assphone=' + (_param.assphone || '')
      t.src = 'https://520activity.test511.com/index.html?' + _data
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
              // this.skipPage('homeContainerTop')
              t.syncLoadLayer({
                type: 'login',
                show: true
              })
            },
            cancel => {
              t.$common.clearUserInfo()
              t.$router.push('/wx')
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
          } catch (error) {
            console.log(error)
          }
        })()
      }


      // 分享
      function get_share(){
      // alert("测试分享接口1");
      $.ajax({
        url: "https://intf.520activity.test511.com/index.php?g=Fawtoyota&m=Subscribe&a=wexins&groupid=" + (encodeURIComponent(location.href) || ''),
        data: {
          // groupid:'sc_activity_may'
        },
        type: 'get',
        dataType: 'json',
        success: function(data) {
          // alert(1)
          // console.log('data:', data)
        wx.config({
          debug: false,
          appId: data.data.appid,
          timestamp: data.data.timestamp,
          nonceStr: data.data.noncestr,
          signature: data.data.signature,
          // 需要使用的JS接口列表
          jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'updateAppMessageShareData',
          'updateTimelineShareData'
          ]
        });
        wx.ready(function() {
          wx.onMenuShareTimeline({
          title: '爱你不止520', // 分享标题
          link: data.data.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          // link: 'http://mall.ftms.devbmsoft.cn/wx/activityMay?groupid=' + (_param.groupid || ''),
          imgUrl: 'https://intf.520.test511.com/520gb.jpg', // 分享图标
          success: function() {
            // alert("分享成功");
            // 用户点击了分享后执行的回调函数
            // doShareDone_p();
          },
          cancel:function(){
            // alert("分享取消");
          },
          fail:function(){
            // alert("分享fail");
          },
          error:function(){
            // alert("分享err");
          }
          });
          
          wx.onMenuShareAppMessage({
          title: '爱你不止520', // 分享标题
          desc: '翻牌告白，礼享为TA', // 分享描述
          link: data.data.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          // link: 'http://mall.ftms.devbmsoft.cn/wx/activityMay?groupid=' + (_param.groupid || ''),
          imgUrl:'https://intf.520.test511.com/520gb.jpg', // 分享图标
          success:function() {
            // alert("分享成功");
            // 用户点击了分享后执行的回调函数
            // doShareDone_p();
          },
          cancel:function(){
            // alert("分享取消");
          },
          fail:function(){
            // alert("分享fail");
          },
          error:function(){
            // alert("分享err");
          }
          });
        });
        },
        error: function(err) {
        // alert("请求接口失败");
        }
      });
      }
      get_share()

      // document.body.className='fancybox-lock-test';
      window.addEventListener('message', function(e) {
        // console.log(document.body)
        if (e) {
          // document.documentElement.scrollTop = document.body.scrollTop = 0
          if(e.data == 1) {
            document.body.className='fancybox-lock-test';
          }else if (e.data ==2) {
            document.body.className='';
          }else if (e.data ==3) {
            var u = navigator.userAgent, app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isAndroid) {
            }
            if (isIOS) {
              document.body.scrollTop = document.body.scrollTop
            }
          }
        }
      }, false)


      document.addEventListener('touchstart',function (event) {  
        if(event.touches.length>1){  
          event.preventDefault();  
        }  
      })  
      var lastTouchEnd=0;  
      document.addEventListener('touchend',function (event) {  
        var now=(new Date()).getTime();  
        if(now-lastTouchEnd<=300){  
          event.preventDefault();  
        }  
        lastTouchEnd=now;  
      },false)  
      // 阻止双指放大
      document.addEventListener('gesturestart', function(event) {
          event.preventDefault();
      })
    },
    methods: {
      // 跳转
      // skipPage(id) {
      //   let t = this
      //   window.location.hash = '#' + id
      //   setTimeout(() => { // 清除hash
      //     t.$router.replace('')
      //   }, 600)
      // },
      querryStringToObject(str) {
        const search = str.replace(/^\s+/, '').replace(/\s+$/, '').match(/([^?#]*)(#.*)?$/)
        if (!search) {
          return {}
        }
        const searchStr = search[1]
        const searchHash = searchStr.split('&')

        const ret = {}
        searchHash.forEach((pair) => {
          const temp = (pair.split('=', 1))[0]
          const key = decodeURIComponent(temp)
          let value = pair.substring(key.length + 1)
          if (value !== undefined) {
            value = decodeURIComponent(value)
          }
          if (key in ret) {
            if (ret[key].constructor !== Array) {
              ret[key] = [ret[key]]
            }
            ret[key].push(value)
          } else {
            ret[key] = value
          }
        })
        return ret
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
  .fancybox-lock-test {
    overflow-y: hidden;
    /*为了兼容普通PC的浏览器*/
    height: 100%;
    position: fixed;
  }
</style>


