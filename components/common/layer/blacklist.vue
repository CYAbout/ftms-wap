<template>
  <!--黑名单-->
  <mt-popup
    class="blacklist-layer"
    v-model="blacklistPopupVisible"
    popup-transition="popup-fade">
    <div class="blacklist-content">
      <h4 class="blacklist-title">没有购买权限，如有疑问，请联系客服～</h4>
    </div>
    <!--关闭按钮-->
    <div @click="blacklistPopupVisible = false" class="close-btn"><i class="iconfont icon-guanbi"></i></div>
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
        blacklistPopupVisible: this.show
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.blacklistPopupVisible = val
      },
      blacklistPopupVisible (val) {
        if (!val) {
          this.$emit('close', {
            type: 'blacklist',
            show: val
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/blacklist';
</style>
