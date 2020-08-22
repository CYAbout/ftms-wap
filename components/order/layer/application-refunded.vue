<template>
  <!--申请退款-->
  <mt-popup
    class="application-refunded-layer"
    v-model="applicationRefundPopupVisible"
    popup-transition="popup-fade">
    <div v-show="!confirmShow" class="application-refunded-content">
      <!--编辑栏-->
      <div class="application-refunded-content-title">你的订单支付时间已经超过86天，</div>
      <div class="application-refunded-content-title">为了保证及时退款，请填写银行卡信息！</div>
      <div class="edit-line bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="edit-label">户名：</div>
        <input v-model="accountName" type="text" class="bm-flex edit-input" placeholder="请输入户名">
      </div>
      <div class="edit-line bm-box bm-box-horizontal bm-box-vertical-center">
         <div class="edit-label">开户行：</div>
        <div @click="clickSelect('accountBank')" class="bm-flex edit-select">
          <span :style="options.accountBank ? {}:{ color: '#999999' }">{{options.accountBank ? options.accountBank : '请选择开户行'}}</span>
          <i class="iconfont icon-down-min"></i>
        </div>
      </div>
       <div class="edit-line bm-box bm-box-horizontal bm-box-vertical-center">
         <div class="edit-label">开户行省份：</div>
        <div @click="clickSelect('accountBankProvince')" class="bm-flex edit-select">
          <span :style="options.accountBankProvince ? {}:{ color: '#999999' }">{{options.accountBankProvince ? options.accountBankProvince : '请选择开户行省份'}}</span>
          <i class="iconfont icon-down-min"></i>
        </div>
      </div>
       <div class="edit-line bm-box bm-box-horizontal bm-box-vertical-center">
         <div class="edit-label">开户行城市：</div>
        <div @click="clickSelect('accountBankCity')" class="bm-flex edit-select">
          <span :style="options.accountBankCity ? {}:{ color: '#999999' }">{{options.accountBankCity ? options.accountBankCity : '请选择开户行城市'}}</span>
          <i class="iconfont icon-down-min"></i>
        </div>
      </div>
       <div class="edit-line bm-box bm-box-horizontal bm-box-vertical-center">
         <div class="edit-label">账号：</div>
         <input v-model="accountNo" type="text" class="bm-flex edit-input" placeholder="请输入银行卡卡号">
      </div>
       <div class="edit-line bm-box bm-box-horizontal bm-box-vertical-center">
         <div class="edit-label">退款原因：</div>
        <div @click="clickSelect('reason')" class="bm-flex edit-select">
          <span>{{options.reason}}</span> <i class="iconfont icon-down-min"></i>
        </div>
      </div>

      <div v-show="options.reason === '其他原因'" class="edit-line bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="edit-label">其他原因：</div>
        <div class="bm-flex edit-textarea">
          <textarea v-model="otherReason" rows="3" maxlength="50"></textarea>
          <i class="word">50字</i>
        </div>
      </div>

      <!--查看规则-->
      <div class="to-rules bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex"></div>
        <!--<div @click="refundRuleTip" class="look-rule"><i class="iconfont icon-rule"></i>退款规则</div>-->
      </div>

      <!--退款规则-->
      <prompt :show="promptShow" :type="'refund-rule'" @close="doClose"></prompt>

      <!--保存按钮-->
      <div @click="doConfirm" class="save-btn">
        <i class="iconfont icon-save"></i>保存
      </div>

      <!--提示信息-->
      <div class="refund-tip">
        退款申请提交后需等待经销商审核，审核通过后我们会将款项三个工作日退回到您的账户中，请耐心等待～
      </div>
    </div>
    <!--关闭按钮-->
    <div @click="applicationRefundPopupVisible = false" class="close-btn"><i class="iconfont icon-pay-fail"></i></div>
    <confirm v-show="confirmShow2" @cancel="confirmCancel" @ok="confirmOk"></confirm>
  </mt-popup>
</template>

<script>
  import _ from 'lodash'
  import { mapState } from 'vuex'
  import Request from '~/plugins/request'
  import prompt from '~/components/common/layer/prompt.vue'
  import commonSelect from '~/components/common/layer/common-select.vue'
  import confirm from '~/components/book/layer/confirm.vue'

  export default {
    props: {
      'show': {
        type: Boolean,
        default: false
      },
      'options': {
        type: Object,
        default: () => { // 不传参数时使用默认值
          // 默认值
          return {
            orderNo: '',
            reason: '',
            accountBank: '',
            accountBankProvince: '',
            accountBankCity: '',
            cityId: '',
            provinceId: ''
          }
        }
      }
    },
    components: {
      prompt, commonSelect, confirm
    },
    data () {
      return {
        provinceShow: false,
        provinceObj: {
        // 省
          selected: {},
          selectList: [],
          list: []
        },
        cityShow: false,
        cityObj: {
        // 市
          selected: {},
          selectList: [],
          list: []
        },
        confirmShow: false,
        confirmShow2: false,
        promptShow: false,
        applicationRefundPopupVisible: this.show,
        otherReason: '',
        accountName: '',
        accountNo: '',
        selectShow: {
          accountBank: false
        }
      }
    },
    mounted() {
      // this.getSysCodeValues()
    },
    computed: {
      ...mapState({ // 映射
        userObj: state => state.user.user
      })
    },
    methods: {
      // 获取区域信息
      getRegionInfo(id = '0', callback) {
        let t = this
        Request.getRegionInfo('', id).then(result => {
          if (result.success) {
          // console.log('result:>', result)
            let dataList = result.data || []
            let valuesList = []
            _.each(dataList, (item, key) => {
              valuesList.push(item.name)
            })
            if (id === '0') {
              t.provinceObj = {
              // 省
                selected: dataList[0],
                selectList: [
                  {
                    flex: 1,
                    values: valuesList,
                    defaultIndex: 0, // 默认值
                    className: 'slot-1',
                    textAlign: 'center'
                  }
                ],
                list: dataList
              }
              if (callback) {
                callback(t.provinceObj.selected)
              }
            } else {
              t.cityObj = {
              // 市
                selected: dataList[0],
                selectList: [
                  {
                    flex: 1,
                    values: valuesList,
                    defaultIndex: 0, // 默认值
                    className: 'slot-1',
                    textAlign: 'center'
                  }
                ],
                list: dataList
              }
            }
          }
        })
      },
      selectedChanged(obj) {
        console.log(obj)
        this[obj.type] = obj.value
        this.selectShow[obj.type] = false
      },
      // 退款规则
      refundRuleTip() {
        this.promptShow = true
        // this.$toast('您可以在与经销商签订订车、购车相关合同协议之前，随时提交退款申请。经销商将在3个工作日完成退款审核，如审核通过，将原路返回意向金至您的支付账户，具体到账情况以第三方支付平台及银行规定为准')
      },
      // 关闭弹窗
      doClose(obj) {
        let t = this
        if (obj.type === 'prompt') {
          t.promptShow = false
          t.applicationRefundPopupVisible = false
        }
      },
      // 确定取消弹框显示
      doConfirm() {
        if (this.accountName === '') {
          this.$toast('请输入户名')
          return
        }
        if (this.options.accountBank === '') {
          this.$toast('请选择开户行')
          return
        }
        if (this.options.accountBankProvince === '') {
          this.$toast('请选择开户行省份')
          return
        }
        if (this.options.accountBankCity === '') {
          this.$toast('请选择开户行城市')
          return
        }
        if (this.accountNo === '') {
          this.$toast('请输入银行卡卡号')
          return
        }
        let reg = /[^0-9,\s]+/g
        if (this.accountNo !== '' && reg.test(this.accountNo)) {
          this.$toast('银行卡号只能为数字')
          return
        }
        if (this.accountNo !== '' && this.accountNo.length < 12) {
          this.$toast('银行卡号不能少于12位')
          return
        }
        if (this.options.reason === '' || this.options.reason === '请选择退款原因') {
          this.$toast('请选择退款原因')
          return
        }
        if (this.options.reason === '其他原因' && this.otherReason === '') {
          this.$toast('请填写退款原因')
          return
        }
        this.confirmShow2 = !this.confirmShow2
        this.confirmShow = !this.confirmShow
      },
      confirmCancel() {
        this.confirmShow2 = !this.confirmShow2
        this.confirmShow = !this.confirmShow
      },
      confirmOk() {
        this.confirmShow2 = !this.confirmShow2
        this.applicationRefundPopupVisible = false
        this.doSubmit()
      },
      // 申请退款
      doSubmit () {
        let t = this
        if (t.options.reason === '其他原因' && t.otherReason === '') {
          t.$toast('请填写退款原因')
        } else if (t.options.reason !== '其他原因' && t.options.reason === '') {
          t.$toast('请选择退款原因')
        } else if (t.options.reason === '请选择退款原因') {
          t.$toast('请选择退款原因')
        } else {
          Request.apply({
            ACCESS_TOKEN: t.userObj.data.token,
            bank: this.options.accountBank,
            cardNo: this.accountNo,
            city: this.options.accountBankCity,
            cityId: this.options.provinceId,
            province: this.options.accountBankProvince,
            provinceId: this.options.cityId,
            orderNo: t.options.orderNo,
            reason: (t.options.reason === '其他原因' && t.otherReason !== '') ? t.otherReason : t.options.reason,
            userName: this.accountName
          }).then(result => {
            if (result.success) {
              t.$toast(result.msg || '申请退款提交成功')
              t.$emit('close', {
                type: 'refund-success',
                show: false,
                orderNo: t.options.orderNo
              })
            } else if (result.code === '-10') {
              t.$messageBox.confirm('登录失效，是否重新登录?').then(action => {
                t.syncLoadLayer({
                  type: 'login',
                  show: true
                })
              }, cancel => {
                t.$common.clearUserInfo()
                t.$router.replace('/wx')
              })
            } else {
              t.$toast(result.msg)
            }
          })
        }
      },
      // 点击下拉框
      clickSelect (type) {
        if (type === 'accountBankCity' && !this.options.accountBankProvince) {
          return this.$toast('请先选择开户省份')
        }
        this.$emit('close', {
          type,
          show: true
        })
      }
    },
    filter: {},
    watch: {
      // 监听show改变
      show (val) {
        this.applicationRefundPopupVisible = val
      },
      applicationRefundPopupVisible (val) {
        if (!val) {
          // eslint-disable-next-line no-undef
          $('.bm-content').css({'overflow-y': 'auto'})
          this.$emit('close', {
            type: 'refunded',
            show: val
          })
        } else {
          // eslint-disable-next-line no-undef
          $('.bm-content').css({'overflow-y': 'hidden'})
        }
      }
    }
  }
</script>
<style lang="scss">
  //noinspection CssUnknownTarget
  @import './sass/application-refunded';
</style>
