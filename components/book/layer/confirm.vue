<template>
  <mt-popup
    class="pay-tip-layer"
    :closeOnClickModal="false"
    popup-transition="popup-fade"
  >
    <div class="pay-tip-content">
      <div class="text">为了保证您的资金及时到账，请确认您填写的银行卡信息是正确的！</div>

      <!--按钮组-->
      <div class="btn-group bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex btn-item" @click="ok">确认</div>
        <div class="bm-flex btn-item" @click="cancel">关闭</div>
      </div>
    </div>
  </mt-popup>
</template>

<script>

export default {
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  computed: {

  },
  methods: {
    ok() {
      this.$emit('ok')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss">
@import "sass/confirm";
</style>
