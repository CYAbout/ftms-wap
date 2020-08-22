<template>
  <div class="container">
    <div class="allScore">
      <p>总体评分</p>
      <stars 
        :starsNum=5 
        :score="globalScore" 
        :starWidth=25 
        :starHeight=25 
        :starMargin=15 
        :mark=false>
      </stars>
    </div>
    <div class="everyScore">
      <div> 
        <b>{{showScoreName(1)}}</b>
        <stars 
          :starsNum=5 
          :starWidth=20 
          :starHeight=20 
          :starMargin=2   
          :mark=false 
          :score="productScore" 
          :specialName="showScoreName(1)">
        </stars>
      </div>
       <div> 
        <b>{{showScoreName(2)}}</b>
        <stars 
          :starsNum=5 
          :starWidth=20 
          :starHeight=20 
          :starMargin=2   
          :mark=false 
          :score="mallScore" 
          :specialName="showScoreName(2)">
        </stars>
      </div>
       <div> 
        <b>{{showScoreName(3)}}</b>
        <stars 
          :starsNum=5 
          :starWidth=20 
          :starHeight=20 
          :starMargin=2   
          :mark=false 
          :score="dealerScore" 
          :specialName="showScoreName(3)">
        </stars>
      </div>
      <textarea v-model="assessment" cols="30" rows="10" disabled placeholder="你的评价很重要哦~"></textarea>
    </div>
  </div>
</template>

<script>
// import Request from '~/plugins/request'
import { mapState } from 'vuex'
import stars from '~/components/evaluation/layer/stars.vue'

export default {
  name: 'comprehensiveScore',
  props: [
    'orderNo', //  获取订单号
    'globalScore',
    'mallScore',
    'productScore',
    'dealerScore',
    'assessment'
  ],
  data() {
    return {
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
    showScoreName(index) {
      const name = ['商品满意度', '购物体验', '经销商服务满意度']
      return name[index - 1]
    },
    getScoreKey(index) {
      const key = ['productScore', 'mallScore', 'dealerScore']
      return key[index - 1]
    }
  }
}
</script>

<style lang="scss">
   @import './sass/comprehensive-score';
</style>
  