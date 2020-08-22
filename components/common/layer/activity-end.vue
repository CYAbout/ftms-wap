<template>
  <mt-popup
    class="activity-end"
    v-model="activityEndVisible"
    popup-transition="popup-fade">
    <div class="activity-content">
      <div v-if="type === 'shelf'" class="text">抱歉，活动暂时下架啦～</div>
      <div v-else class="text">抱歉，活动已结束啦～</div>

      <!--按钮组-->
      <div class="btn-group bm-box bm-box-horizontal bm-box-vertical-center">
        <div @click="triggerAction('back')" class="bm-flex btn-back"><i class="iconfont icon-back"></i>返回首页</div>
        <div @click="triggerAction('refresh')" class="bm-flex btn-refresh"><i class="iconfont icon-refresh"></i>刷新</div>
      </div>
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
        default: 'end' // end -- 活动结束； shelf -- 活动下架
      }
    },
    data () {
      return {
        activityEndVisible: this.show
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
        this.activityEndVisible = val
      },
      activityEndVisible (val) {
        if (!val) {
          this.$emit('close', {
            type: 'activity-end',
            show: val
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/activeity-end';
</style>
