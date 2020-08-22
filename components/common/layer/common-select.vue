<template lang="html">
  <!-- 公共列表选择 -->
  <mt-popup
    class="common-select"
    :closeOnClickModal="false"
    v-model="commonSelectShow"
    position="bottom">
    <div class="select-titles bm-flex bm-box bm-box-horizontal">
      <div @click="doCancle" class="btn">取消</div>
      <div class="bm-flex"></div>
      <div @click="doOk" class="btn">确定</div>
    </div>
    <mt-picker :slots="options" @change="onValuesChange"></mt-picker>
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
        default: 'select'
      },
      'options': {
        type: Array,
        default: () => { // 不传参数时使用默认值
          // 默认值
          return [
            {
              flex: 1,
              values: [],
              defaultIndex: 0, // 默认值
              className: 'slot-1',
              textAlign: 'center'
            }
          ]
        }
      }
    },
    data () {
      return {
        commonSelectShow: this.show,
        currentVal: ''
      }
    },
    mounted () {
    },
    methods: {
      // 改变回调
      onValuesChange (picker, values) {
        // console.log(picker)
        // console.log(values)
        // picker.setSlotValue(0, '2015-03') // 设定给定 slot 被选中的值，该值必须存在于该 slot 的备选值数组中
        // console.log(picker.getSlotValue(0))
        this.currentVal = values[0] || ''
      },
      // 取消
      doCancle () {
        let t = this
        t.$emit('changed', {
          type: t.type,
          show: false,
          value: ''
        })
      },
      // 确定
      doOk () {
        let t = this
        let arr1 = this.options[0]
        let arr2 = arr1.values
        let ifHave = false
        if (t.currentVal === '' || t.currentVal === null || t.currentVal === undefined) {
          t.currentVal = this.options[0].values[0]
        } else {
          if (t.type === 'accountBank' || t.type === 'accountBankProvince' || t.type === 'accountBankCity' || t.type === 'reason') {
            if (t.currentVal !== this.options[0].values[0]) {
              // t.currentVal = ''
              console.log(arr2)
              arr2.forEach(item => {
                if (item === t.currentVal) {
                  ifHave = true
                }
              })
              if (ifHave) {
                t.currentVal = t.currentVal
              } else {
                t.currentVal = this.options[0].values[0]
              }
            } else {
            }
          }
        }
        console.log(t.type)
        t.$emit('changed', {
          type: t.type,
          show: false,
          value: t.currentVal
        })
        if (t.type === 'accountBank') {
          if (t.currentVal !== this.options[0].values[0]) {
            t.currentVal = this.options[0].values[0]
          } else {
            t.currentVal = ''
          }
        } else if (t.type === 'accountBankProvince') {

        } else if (t.type === 'accountBankCity') {
        }
      }
    },
    watch: {
      show (val) {
        this.commonSelectShow = val
        if (val) {
          // eslint-disable-next-line no-undef
          $('.bm-content').css({'overflow-y': 'hidden'})
        } else {
          // eslint-disable-next-line no-undef
          $('.bm-content').css({'overflow-y': 'auto'})
        }
      }
    }
  }
</script>
<style lang="scss">
  @import './sass/common-select.scss';
</style>
