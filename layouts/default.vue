<template>
  <div class="page-main">
    <!--头部-->
    <common-header></common-header>
    <div class="bm-content bm-hasScroll home-content">
      <div class="content-area" id="homeContainerTop">
        <nuxt/>
        <!--尾部-->
        <common-footer></common-footer>
      </div>
    </div>
  </div>
</template>
<script>
  import commonHeader from '~/components/common/common-header.vue'
  import commonFooter from '~/components/common/common-footer.vue'

  export default {
    components: {
      commonHeader,
      commonFooter
    }
  }
</script>

<style type="text/css">
  .page-main {
    /*overflow: hidden;*/
  }

  .content-area {
    position: -webkit-sticky;
  }
</style>
