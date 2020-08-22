<template>
  <!--设置密码成功-->
  <mt-popup
    class="set-success-layer"
    v-model="successPopupVisible"
    popup-transition="popup-fade">
    <div class="set-success-content">
      <h4 class="set-success-title">忘记密码</h4>

      <!--图标-->
      <i class="icon iconfont icon-success"></i>
      <div class="success-tip">恭喜您，密码重置成功！</div>

      <!--完成按钮-->
      <div @click="doComplete" class="complete-btn">完成</div>
    </div>
    <!--关闭按钮-->
    <div @click="successPopupVisible = false" class="close-btn"><i class="iconfont icon-guanbi"></i></div>
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
        successPopupVisible: this.show
      }
    },
    methods: {
      // 完成
      doComplete () {
        this.$emit('close', {
          type: 'success',
          show: false,
          flag: 'complete'
        })
      }
    },
    watch: {
      // 监听show改变
      show (val) {
        this.successPopupVisible = val
      },
      successPopupVisible (val) {
        if (!val) {
          this.$emit('close', {
            type: 'success',
            show: val,
            flag: ''
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/set-success';
</style>
