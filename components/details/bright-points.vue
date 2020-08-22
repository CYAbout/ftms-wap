<template>
  <div>
  <!-- 设置暗锚点 -->
  <div id="an_bright" style="position: relative;top: -3.7rem;height: 0;overflow: hidden;"></div>
  <!--车型亮点-->
  <div class="model-bright-points" id="bright">
    <h4 class="title">车型亮点</h4>
    <div class="bright-points-pics" v-html="options"></div>
    <!--<ul class="bright-points">-->
    <!--<li class="points-item">-->
    <!--<img src="~/assets/images/car_sale/image5.png"/>-->
    <!--<div class="bright-points-details">-->
    <!--<h5>引人注目的设计</h5>-->
    <!--<p>无论您走到哪里，Avalon引人注目的前格栅都会发出声明。强烈的个性线条和雕刻表面突出了低而宽的姿态，营造出时尚的轮廓，无可挑剔。</p>-->
    <!--</div>-->
    <!--</li>-->
    <!--<li class="points-item">-->
    <!--<img src="~/assets/images/car_sale/image1.png"/>-->
    <!--<div class="bright-points-details left">-->
    <!--<h5>技术+连通性</h5>-->
    <!--<p>随着可用的1200瓦JBL ®音响系统， Entune ™ 3.0，苹果CarPlay ™，以及Apple关注® 和可用的Android ™智能手表的兼容性，阿瓦隆提供了丰富的技术与你保持向上的。</p>-->
    <!--</div>-->
    <!--</li>-->
    <!--<li class="points-item">-->
    <!--<img src="~/assets/images/car_sale/image8.png"/>-->
    <!--<div class="bright-points-details left">-->
    <!--<h5>惊险的表现</h5>-->
    <!--<p>Avalon Touring的空气动力学外形是一个动态的全新自适应可变悬架（AVS）和一个301马力的3.5升V6发动机，每次踩踏板时都可以执行。</p>-->
    <!--</div>-->
    <!--</li>-->
    <!--<li class="points-item">-->
    <!--<img src="~/assets/images/car_sale/image2.png"/>-->
    <!--<div class="bright-points-details left">-->
    <!--<h5>丰田Safety Sense ™ P（TSS-P）</h5>-->
    <!--<p>安心是标准配置，主动安全套件包括预碰撞系统和行人检测（PCS w / PD），动态雷达巡航控制（DRCC）以及更多 - 所有这些都可以帮助您增强信心。</p>-->
    <!--</div>-->
    <!--</li>-->
    <!--</ul>-->
  </div>
</div>
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
  @import './sass/bright-points';
</style>
