<template>
  <!--未完成问卷调查-->
  <mt-popup
    class="complete-survey-layer"
    v-model="surveyPopupVisible"
    popup-transition="popup-fade">
    <div class="survey-content">
      <h4 class="survey-title">您还没有完成问卷调查哦～</h4>

      <!--问卷调查按钮-->
      <div @click="doQuestions" class="questionnaire-btn">
        <i class="iconfont icon-do-selected"></i>立即参与调查
      </div>
    </div>
    <!--关闭按钮-->
    <div @click="surveyPopupVisible = false" class="close-btn"><i class="iconfont icon-pay-fail"></i></div>
  </mt-popup>
</template>

<script>
  export default {
    props: {
      'show': {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        surveyPopupVisible: this.show
      }
    },
    methods: {
      // 问卷调查
      doQuestions () {
        this.$emit('close', {
          type: 'questionnaire',
          show: true
        })
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.surveyPopupVisible = val
      },
      surveyPopupVisible (val) {
        if (!val) {
          // eslint-disable-next-line no-undef
          $('.bm-content').css({'overflow-y': 'auto'})
          this.$emit('close', {
            type: 'survey',
            show: val
          })
        } else {
          // eslint-disable-next-line no-undef
          $('.bm-content').css({'overflow-y': 'hidden'})
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/complete-survey';
</style>
