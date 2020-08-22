<template>
  <mt-popup
    class="prompt-layer"
    v-model="promptLayerVisible"
    popup-transition="popup-fade">
    <div class="prompt-content">
      <h5 class="prompt-title">提示</h5>
      <div v-if="type === 'collection'" class="text">已添加到心愿单，可以去个人中心-我的心愿单中查看。</div>
      <div v-else-if="type === 'refund-rule'" class="text">您可以在与经销商签订订车、购车相关合同协议之前，随时提交退款申请。经销商将在3个工作日完成退款审核，如审核通过，将原路返回意向金至您的支付账户，具体到账情况以第三方支付平台及银行规定为准</div>
      <div @click="promptLayerVisible = false" class="close-btn"><i class="iconfont icon-guanbi"></i>关闭</div>
    </div>
  </mt-popup>
</template>

<script>
  export default {
    props: {
      'show': {
        type: Boolean,
        default: false
      },
      'type': {
        type: String,
        default: 'collection' // collection -- 心愿单  refund-rule -- 活动规则 end -- 活动结束； shelf -- 活动下架
      }
    },
    data () {
      return {
        promptLayerVisible: this.show
      }
    },
    methods: {
      // 触发操作 back || refresh
      triggerAction (flag = 'back') {
        let t = this
        t.$emit('action', {
          type: t.type,
          flag: flag
        })
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.promptLayerVisible = val
      },
      promptLayerVisible (val) {
        if (!val) {
          this.$emit('close', {
            type: 'prompt',
            show: val
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/prompt';
</style>
