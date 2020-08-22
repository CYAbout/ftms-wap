<template>
  <div class="home-container">
    <!--广告轮播-->
    <home-swipe :options="swipeList"></home-swipe>

    <!--预售-->
    <home-presell :options="newCarList"></home-presell>

    <!--明星车型-->
    <star-model :stage="pickStage"></star-model>

    <!--火热活动-->
    <hot-activity :options="activityList"></hot-activity>

    <!--2019年双车抽奖-->
    <div id="lucky"
      @mousedown="down($event)" @touchstart="down($event)"
      @mousemove="move($event)" @touchmove="move($event)"
      @mouseup="end($event)" @touchend="end($event)"
      class="" style="position: fixed;z-index: 1000;bottom:2rem;right: 0.01rem">
      <img @click="goLucky"  v-show="luckyShow&&actIconShow!==1&&pickStage!='2'" style="width:2rem;height:2rem;" src="~/assets/images/top_bottom/choujiang.png"/>
      <img @click="goLucky"  v-show="pickStage == '2'" style="width:2rem;height:2rem;" src="~/assets/images/top_bottom/activity520.png"/>
    </div>
    <!--2019年双车抽奖-->
    <!-- 4.1活动 -->
    <div v-show="actShow==1" class="pop_wrap wrapShow">
    </div>
    <div v-show="actShow==1" class="show">
      <p class="img" @click="goActive"><img src="~/assets/images/home/pop_wap_bg.jpg" alt=""></p>
      <p v-if="actStage=='2'" class="contentShow">距离抢购开始:<span>{{day}}</span>天<span>{{hour}}</span>时<span>{{minute}}</span>分<span>{{second}}</span>秒</p>
      <p v-if="actStage=='3'" class="contentShow">抢购进行中</p>
      <p v-if="actStage=='4'" class="contentShow">距离抢购结束:<span>{{day}}</span>天<span>{{hour}}</span>时<span>{{minute}}</span>分<span>{{second}}</span>秒</p>
      <p class="btnShow" @click.stop="toggleHide"><img src="~/assets/images/home/pop_wap_close.png" alt=""></p>
    </div>
    <a href="http://www.knowology.cn:8082/OnlineCustomer_YQFT/index.html" target="_blank">
      <div v-show="actIconShow==1" class="iconShow" style="z-index: 900">
        <!-- <img src="~/assets/images/home/pop_float_wap.png"/> -->
        <img src="~/assets/images/home/float_online.png"/>
      </div>
    </a>
    <!-- 4.1活动 -->

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Request from '~/plugins/request.js'
  import homeSwipe from '~/components/home/home-swipe.vue'
  import homePresell from '~/components/home/home-presell.vue'
  import starModel from '~/components/home/star-model.vue'
  import hotActivity from '~/components/home/hot-activity.vue'

  export default {
    name: 'home',
    components: {
      homeSwipe,
      homePresell,
      starModel,
      hotActivity
    },
    head () {
      return {
        title: '一汽丰田官方商城',
        meta: [ // seo
          {hid: 'keywords', name: 'keywords', content: ''},
          {hid: 'description', name: 'description', content: ''}
        ]
      }
    },
    data() {
      return {
        flags: false,
        position: { x: 0, y: 0 },
        nx: '',
        ny: '',
        dx: '',
        dy: '',
        xPum: '',
        yPum: '',
        luckyShow: false,
        luckDrawShow: false,
        pickStage: 1, // 1代表活动未开始2代表活动进行中  3代表 活动已结束
        actIconShow: 0,
        actShow: 0,
        exa: true,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        actStage: '6',
        timestamp: 0
      }
    },
    mounted () {
      let t = this
      t.activityMay()
      t.getIsActiviting()
      t.yzlActivityTime()
      // t.getActivityState()
      setInterval(() => {
        t.getIsActiviting()
        t.yzlActivityTime()
      }, 60000)
      let origin = t.$util.Params.query('origin') || ''
      if (origin) {
        console.log('origin:>', origin)
        t.$cache.origin.set(origin) // 存储来源
      }
      // 获取广告信息
      t.$store.dispatch('getAdvertisementList')

      // 异步调用
      // (async () => {
      //   try {
      //     await this.$store.dispatch('getIndexData')
      //   } catch (error) {
      //     console.log(error)
      //   }
      // })()
    },
    methods: {
      // 实现移动端拖拽
      down(event) {
        console.log(event)
        var moveDiv = document.getElementById('lucky')
        this.flags = true
        var touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        this.position.x = touch.clientX
        this.position.y = touch.clientY
        this.dx = moveDiv.offsetLeft
        this.dy = moveDiv.offsetTop
      },
      move() {
        let moveDiv = document.getElementById('lucky')
        if (this.flags) {
          var touch = null
          if (event.touches) {
            touch = event.touches[0]
          } else {
            touch = event
          }
          this.nx = touch.clientX - this.position.x
          this.ny = touch.clientY - this.position.y
          this.xPum = this.dx + this.nx
          this.yPum = this.dy + this.ny
          // window宽 - 点击的轴坐标 - box大小
          moveDiv.style.right = document.documentElement.clientWidth - this.xPum - moveDiv.offsetWidth + 'px'
          moveDiv.style.bottom = document.documentElement.clientHeight - this.yPum - moveDiv.offsetHeight + 'px'
          // 阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
          event.preventDefault()
        }
      },
      // 鼠标释放时候的函数
      end() {
        let moveDiv = document.getElementById('lucky')
        let myHeader = document.getElementById('myHeader')
        let winWith = document.documentElement.clientWidth // 窗口宽度
        let winHeight = document.documentElement.clientHeight // 窗口高度
        let boxWidth = moveDiv.offsetWidth // 事件盒子宽度
        let boxHeight = moveDiv.offsetHeight // 事件盒子高度
        let headHeight = myHeader.offsetHeight // 头部header高度
        this.flags = false
        console.log('--end--')
        // 判断右侧边界
        if ((winWith - this.xPum - boxWidth) < 0) moveDiv.style.right = 0
        // 判断下侧边界
        if ((winHeight - this.yPum - boxHeight) < 0) moveDiv.style.bottom = 0
        // 判断左侧边界
        if (moveDiv.offsetLeft < 0) moveDiv.style.right = winWith - boxWidth + 'px'
        // 判断上侧边界
        if (moveDiv.offsetTop - headHeight < 0) moveDiv.style.bottom = winHeight - headHeight - boxHeight + 'px'
      },
      // 4.11活动
      toggleHide(e) {
        this.actIconShow = 1
        this.actShow = 0
      },
      goActive() {
        this.$router.push('/wx/yhctzcgz?groupid=sc_tc_yhct')
      },
      goLine() {
        window.location.href = 'http://www.knowology.cn:8082/OnlineCustomer_YQFT/index.html'
      },
      ifUpdateTime() {
        // let data = JSON.parse(this.$storage.get('act_icon'))
        let data = this.$common.getActIcon()
        let time0 = new Date(new Date().toLocaleDateString()).getTime()
        if (data) {
          let saveTime = data.date
          if (saveTime > time0) { // 今天进过页面
            this.actIconShow = 1
          } else { // 之前进过页面，今天没有
            this.actShow = 1
            this.$common.saveActIcon()
          }
        } else { // 第一次进入页面
          this.actShow = 1
          this.$common.saveActIcon()
        }
        console.log(new Date(data.date), new Date(time0))
      },
      // 4.11活动状态
      countNum(remain) {
        // const end = Date.parse(new Date('2019-03-26 24:00'))
        // let nowTime = Date.parse(new Date())
        // let remain = end - nowTime
        this.timer = setInterval(() => {
          if (remain > 1000) {
            remain -= 1000
            let day = Math.floor((remain / 1000 / 3600) / 24)
            let hour = Math.floor((remain / 1000 / 3600) % 24)
            let minute = Math.floor((remain / 1000 / 60) % 60)
            let second = Math.floor((remain / 1000 % 60))
            this.day = day
            this.hour = hour < 10 ? '0' + hour : hour
            this.minute = minute < 10 ? '0' + minute : minute
            this.second = second < 10 ? '0' + second : second
          } else {
            clearInterval(this.timer)
            // this.getActivityState()
          }
        }, 1000)
      },
      setActTime() {
        this.$storage.setWithTime('act_icon', '3')
      },
      // 520活动入口显示
      activityMay() {
        Request.activityMay({
          ACCESS_TOKEN: this.userObj.data.token
        }).then(v => {
          this.pickStage = v.data.activityStage
        })
      },
      // 2019年双车抽奖 判断是否在phev活动期间内
      getIsActiviting() {
        Request.phevActivityTime({
          ACCESS_TOKEN: this.userObj.data.token
        }).then(v => {
          console.log(v.data)
          this.luckyShow = v.data
        })
      },
      // 判断亚洲龙抽奖活动开始时间
      yzlActivityTime() {
        Request.yzlActivityTime().then(v => {
          console.log(v.data)
          this.luckDrawShow = v.data
        })
      },
      getActivityState() {
        Request.getActivityState().then(v => {
          if (v.code === '0') {
            if (v.data.activityStage) {
              if (v.data.activityStage === '2' || v.data.activityStage === '3' || v.data.activityStage === '4') {
                this.actIconShow = 1
                this.actStage = v.data.activityStage
                this.timestamp = v.data.currentTimestamp
                this.ifUpdateTime()
                this.countNum(v.data.currentTimestamp)
              }
            }
          }
        })
      },
      // 2019年双车抽奖
      goLucky() {
        let t = this
        if (t.pickStage === '2') {
          t.$router.push('/wx/activityMay?groupid=sc_activity_may')
          return
        }
        if (t.luckDrawShow) {
          t.$router.push('/wx/luckdraw')
        } else {
          t.$router.push('/wx/lucky')
        }
        // if (!t.userObj.logined) { // 未登录
        //   t.$common.clearUserInfo()
        //   t.$messageBox.confirm('登录后才能抽奖，是否登录?').then(action => {
        //     this.skipPage('homeContainerTop')
        //     t.syncLoadLayer({
        //       type: 'login',
        //       show: true
        //     })
        //   }, cancle => {
        //   })
        // } else {
        //   t.$router.push('/wx/lucky')
        // }
      },
      mousedown () {
        console.log('hahahah')
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
      // userAgent () {
      //   return this.$store.state.option.userAgent // ua
      // },
      // userData () {
      //   return this.$store.state.user.user // ua
      // },
      ...mapState({ // 映射
        userObj: state => state.user.user,
        swipeList: state => state.home.swipeList,
        newCarList: state => state.home.newCarList,
        activityList: state => state.home.activityList
      })
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import '~/assets/sass/pages/index.scss';
</style>

