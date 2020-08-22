<template>
  <div class="container">
    <div class="allScore">
      <p>总体评分</p>
      <stars
        :starsNum=5
        :score="globalScore"
        :starWidth=20
        :starHeight=20
        :starMargin=15
        :mark=false>
      </stars>
    </div>
    <div class="everyScore">
      <div v-for="index in 3" :key="index">
        <b>{{showScoreName(index)}}</b>
        <stars
          :starsNum=5
          :starWidth=15
          :starHeight=15
          :starMargin=2
          :mark=true
          @markScore="handleMarkScore"
          :specialName="showScoreName(index)">
        </stars>
      </div>
      <textarea v-model="assessment" cols="30" rows="10" placeholder="你的评价很重要哦~" maxlength="500" style=" font-size:0.42rem; color:#666;"></textarea>
      <i class="wordnum">500字</i>
    </div>
    <div class="commit" @click="insertAssessment()">提交评价</div>
  </div>
</template>

<script>
import Request from '~/plugins/request'
import { mapState } from 'vuex'
import stars from '~/components/evaluation/layer/stars.vue'

export default {
  name: 'comprehensiveScore',
  props: [
    'orderNo' //  获取订单号
  ],
  data() {
    return {
      // 评价内容
      assessment: '',
      dealerScore: 0,
      globalScore: 0,
      mallScore: 0,
      productScore: 0
    }
  },
  components: {
    stars
  },
  computed: {
    ...mapState({// 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    handleMarkScore(params1, params2) {
      if (params2 === '商品满意度') {
        this.productScore = params1
      } else if (params2 === '购物体验') {
        this.mallScore = params1
      } else if (params2 === '经销商服务满意度') {
        this.dealerScore = params1
      }
      this.globalScore = (Number(this.productScore) + Number(this.mallScore) + Number(this.dealerScore)) / 3
    },
    showScoreName(index) {
      const name = ['商品满意度', '购物体验', '经销商服务满意度']
      return name[index - 1]
    },
    // 提交评价
    insertAssessment () {
      let t = this
      if (t.productScore === 0) {
        t.$toast('请给商品满意度打分')
      } else if (t.mallScore === 0) {
        t.$toast('请给购物体验打分')
      } else if (t.dealerScore === 0) {
        t.$toast('请给经销商服务打分')
      } else if (!t.assessment) {
        t.$toast('请输入评价')
      } else {
        Request.insertAssessment({
          'ACCESS_TOKEN': t.userObj.data.token,
          assessment: t.assessment,
          dealerScore: String(t.dealerScore),
          globalScore: String(t.globalScore),
          mallScore: String(t.mallScore),
          mobile: t.userObj.data.mobile,
          orderNo: t.orderNo,
          productScore: String(t.productScore)
        }).then(result => {
          if (result.success) {
            t.$toast('评价成功')
            t.toMyEvaluation()
          } else {
            t.$toast(result.msg)
          }
        })
      }
    },
    // 延时跳转个人评价页面
    toMyEvaluation() {
      this.$router.push('/wx/user/evaluation')
      // 跳转放在定时器里会失效 有待研究
      // let timer = null
      // if (timer) {
      //   clearTimeout(timer)
      // } else {
      //   timer = setTimeout(function() {
      //   }, 1000)
      // }
    }
  }
}
</script>

<style lang="scss">
   @import './sass/comprehensive-score';
</style>
