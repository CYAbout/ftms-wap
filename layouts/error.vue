<template>
  <div class="container">
    <div class="error-page">
      <img class="img-404" src="~/static/images/error/404.png"/>
      <div class="icon-text">
        <img src="~/static/images/error/error.png"/>

        <span v-if="error.statusCode === 404">哎呀！页面出错啦～</span>
        <span v-else="">哎呀！应用发生错误异常啦～</span>
      </div>
      <nuxt-link to="/">
        <div class="tip">显示此网页时出现错误，可能暂时无法链接，请返回首页</div>
      </nuxt-link>
    </div>

    <div class="mint-popup error-layer">
      <div class="error-content">
        <div class="text">抱歉，页面跑到火星去了～</div>
        <p class="error-tip">请返回首页</p>

        <div class="btn-back"><nuxt-link class="_link" to="/"><i class="iconfont icon-back"></i>返 回 首 页</nuxt-link></div>
      </div>
    </div>
    <div class="error-mask"></div>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    layout: 'blog' // 你可以为错误页面指定自定义的布局
  }
</script>

<!--加上scoped后书写的样式只在这个vue中有效，但是import引用的不会，会缓存到页面中影响其他dom-->
<style scoped src="~/assets/sass/layouts/error.scss"></style>
