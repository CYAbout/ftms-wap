<template>
  <ul class="starsList">
    <li v-for="item in starsNum" 
      :num="item" 
      :class="propScore ? showStarsType(item) : starsType" 
      :style="starsSize" 
      :specialName="propSpecialName"
      @click="mark ? markScore($event) : null">
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'stars',
    props: [
      'starsNum', // required
      'score',
      'starWidth',
      'starHeight',
      'starMargin',
      'mark', // required 根据mark的布尔值来判断是否可以点击打分，!!为true时不能传入score,父组件可以通过@handleMarkScore来得到分数和标记!!
      'specialName' // 用户自定义特殊标记
    ],
    data() {
      return {
        propScore: this.score || false,
        propSpecialName: this.specialName || null,
        starsType: 'darkStar', // 默认灰色星星
        starsSize: { // 默认星星尺寸为 32px  间距15px
          width: this.starWidth ? this.starWidth + 'px' : null,
          height: this.starHeight ? this.starHeight + 'px' : null,
          marginLeft: this.starMargin ? this.starMargin + 'px' : null
        }
      }
    },
    methods: {
      markScore(e) {
        this.propScore = e.target.getAttribute('num')
        this.propSpecialName = e.target.getAttribute('specialName')
        this.$emit('markScore', this.propScore, this.propSpecialName)
      },
      showStarsType(item) {
        // distance 分数和星星索引的距离（星星的索引是：num 12345 所以不是01234）
        let distance = this.FloatSub(this.propScore, item)
        if (distance > 0) {
          return 'lightStar'
        } else if (Math.abs(distance) < 1) {
          let abs = Math.abs(distance)
          switch (abs) {
            case 0 : return 'lightStar'
            case 0.1 : return 'strongHalfStar'
            case 0.2 : return 'strongHalfStar'
            case 0.3 : return 'strongHalfStar'
            case 0.4 : return 'halfStar'
            case 0.5 : return 'halfStar'
            case 0.6 : return 'halfStar'
            case 0.7 : return 'weakHalfStar'
            case 0.8 : return 'weakHalfStar'
            case 0.9 : return 'weakHalfStar'
          }
        } else {
          return 'darkStar'
        }
      },
      // copy js浮点运算解决 csdn
      FloatAdd (arg1, arg2) {
        var r1, r2, m
        try {
          r1 = arg1.toString().split('.')[1].length
        } catch (e) {
          r1 = 0
        }
        try {
          r2 = arg2.toString().split('.')[1].length
        } catch (e) {
          r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m
      },
      FloatSub (arg1, arg2) {
        var r1, r2, m
        try {
          r1 = arg1.toString().split('.')[1].length
        } catch (e) {
          r1 = 0
        }
        try {
          r2 = arg2.toString().split('.')[1].length
        } catch (e) {
          r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        return ((arg1 * m - arg2 * m) / m).toFixed(1)
      }
    },
    watch: {
      score() {
        this.propScore = this.score
      }
    }
  }
</script>
<style lang="scss">
/* noinspection CssUnknownTarget */
@import './sass/stars.scss';
</style>