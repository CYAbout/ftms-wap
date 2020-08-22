<template>
  <!--核销码 已发送-->
  <mt-popup
    class="send-success-layer"
    v-model="sendPopupVisible"
    popup-transition="popup-fade">
    <div class="send-content">
      <h4 class="send-title">{{cardType}}已经发送到您的手机，请注意查收～</h4>
    </div>
    <!--关闭按钮-->
    <div @click="sendPopupVisible = false" class="close-btn"><i class="iconfont icon-pay-fail"></i></div>
  </mt-popup>
</template>

<script>
  export default {
    props: {
      'show': {
        type: Boolean,
        default: false
      },
      cardType: {
        type: String
      }
    },
    data () {
      return {
        sendPopupVisible: this.show
      }
    },
    methods: {
      // 关闭弹窗
      close() {
        this.$emit('close', {
          type: 'send',
          show: false
        })
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.sendPopupVisible = val
      },
      sendPopupVisible (val) {
        if (!val) {
          // eslint-disable-next-line no-undef
          $('.bm-content').css({'overflow-y': 'auto'})
          this.$emit('close', {
            type: 'send',
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
  @import 'sass/send-success';
</style>
