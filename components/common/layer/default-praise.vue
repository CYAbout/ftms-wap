<template>
  <!--默认好评-->
  <mt-popup
    class="default-praise-layer"
    v-model="praisePopupVisible"
    popup-transition="popup-fade">
    <div class="praise-content">
      <div class="top-pic">
        <span>默认好评</span>
      </div>
      <h4 class="praise-title">本次服务让我十分满意，实现了我的地球梦！</h4>
    </div>
    <!--关闭按钮-->
    <div @click="praisePopupVisible = false" class="close-btn"><i class="iconfont icon-guanbi"></i></div>
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
        praisePopupVisible: this.show
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.praisePopupVisible = val
      },
      praisePopupVisible (val) {
        if (!val) {
          this.$emit('close', {
            type: 'praise',
            show: val
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/default-praise';
</style>
