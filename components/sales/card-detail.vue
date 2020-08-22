<template>
  <!--商品描述-->
  <div class="card-detail" v-html="options"></div>
</template>

<script>
  export default {
    props: {
      'options': {
        type: String,
        default: ''
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import './sass/card-detail';
</style>
