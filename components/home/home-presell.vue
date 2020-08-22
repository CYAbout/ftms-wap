<template>
  <!--预售-->
  <div class="home-presell">
    <div class="link-item" v-for="(obj, index) in options" :key="index">
      <nuxt-link v-if="!obj.linkUrl && !obj.picHrefUrl && obj.productId" class="_link"
                 :to="'/wx/presell/' + obj.productId">
        <img class="presell-item" :src="obj.picUrl"/>
      </nuxt-link>
      <a v-else class="_link" :href="obj.linkUrl || obj.picHrefUrl">
        <img class="presell-item" :src="obj.picUrl"/>
      </a>
    </div>
    <!--<nuxt-link class="_link" to="/"><img class="presell-item" src="~/assets/images/home/carrol_pic_1.png" /></nuxt-link>-->
    <!--<nuxt-link class="_link" to="/"><img class="presell-item" src="~/assets/images/home/carrol_pic_2.png" /></nuxt-link>-->
  </div>
</template>

<script>
  export default {
    props: {
      'options': {
        type: Array,
        default: () => { // 不传参数时使用默认值
          // 默认值
          return []
        }
      }
    }
  }
</script>

<style lang="scss">
  @import './sass/home-presell';
</style>
