<template>
  <!--问卷调查-->
  <!--:closeOnClickModal="false"-->
  <mt-popup
    class="questionnaire-survey-layer"
    v-model="questionnairePopupVisible"
    position="top"
    popup-transition="popup-fade"
  >
    <div class="questionnaire-content">
      <img class="left" src="~/assets/images/survey/left.png">
      <img class="right" src="~/assets/images/survey/right.png">

      <div class="questionnaire-titles">
        <img class="clip" src="~/assets/images/survey/clip.png">
        <h4 class="title">用户意向调查</h4>
        <!--<h4 class="title">亚洲龙和卡罗拉双擎E+</h4>-->
        <!--<div class="sbu-title">（上市初期意向客户调查）</div>-->
      </div>

      <!--问卷-->
      <div class="questionnaire-lists">
        <div v-for="(obj,index) in questionnaireList" :key="obj.code" class="question-item">
          <div class="question" v-if="index<15 || 17<index">
            <i v-show="obj.must">*</i>
            <span>{{obj.code}}: {{obj.question}}</span>
          </div>
          <div v-if="obj.explain" class="explain">{{obj.explain || ''}}</div>
          <div class="answer-list">
            <div
              @click="doCheck(obj, item)"
              v-for="(item, index) in obj.list"
              :key="index"
              class="answer-item bm-box"
              :class="item.code !== ''? 'bm-box-horizontal':'bm-box-vertical no-check'"
            >
              <div v-show="item.code !== ''" class="check-icon" :class="{'checked': item.checked}">
                <i class="iconfont" :class="item.checked? 'icon-check-full':'icon-check-empty'"></i>
              </div>
              <div class="check-name">
                <span v-show="item.code !== ''">{{item.code}}.</span>
                {{item.answer}}
              </div>
              <div v-if="item.type === 'input'" class="bm-flex check-input">
                <input
                  v-if="obj.disabled"
                  disabled
                  v-model="item.value"
                  class="edit-input"
                  placeholder="请注明"
                >
                <input v-else v-model="item.value" class="edit-input" placeholder="请注明">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--提交按钮-->
      <div @click="doSubmit" class="submit-btn">
        <i class="iconfont icon-do-selected"></i>提交
      </div>
    </div>
    <!--关闭按钮-->
    <div @click="questionnairePopupVisible = false" class="close-btn">
      <i class="iconfont icon-guanbi"></i>
    </div>
  </mt-popup>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import Request from '~/plugins/request'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    orderNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      questionnairePopupVisible: this.show,
      questionComplete: false,
      questionnaireList: [
        {
          question: '请选择用户类型',
          code: 'Q1',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          list: [
            {
              answer: '个人用户',
              code: 'A',
              type: 'check', // input
              checked: false
            },
            {
              answer: '法人用户',
              code: 'B',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: '如果是法人用户，请选择用户性质',
          code: 'Q2',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          disabled: false,
          list: [
            {
              answer: '国家机关或事业单位',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '国企或央企',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '民营·私营企业',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '外资企业',
              code: 'D',
              type: 'check',
              checked: false
            },
            {
              answer: '其他（请注明）',
              code: 'E',
              type: 'input',
              checked: false,
              value: ''
            }
          ]
        },
        {
          question: '请选择您的学历',
          code: 'Q3',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          list: [
            {
              answer: '高中及以下',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '中专/技校',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '大专',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '大学本科',
              code: 'D',
              type: 'check',
              checked: false
            },
            {
              answer: '硕士研究生或以上',
              code: 'E',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: '请选择您的职业',
          code: 'Q4',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          disabled: false,
          list: [
            {
              answer: '公司职员',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '事业单位/公务员',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '教师/医生/律师',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '私营业主',
              code: 'D',
              type: 'check',
              checked: false
            },
            {
              answer: '自由职业',
              code: 'E',
              type: 'check',
              checked: false
            },
            {
              answer: '专职主妇',
              code: 'F',
              type: 'check',
              checked: false
            },
            {
              answer: '农业',
              code: 'G',
              type: 'check',
              checked: false
            },
            {
              answer: '其他（请注明）',
              code: 'H',
              type: 'input',
              checked: false,
              value: ''
            }
          ]
        },
        {
          question: '请选择您的婚姻状况',
          code: 'Q5',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          list: [
            {
              answer: '单身未婚',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '已婚/同居无孩',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '已婚有孩',
              code: 'C',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: '请选择您的家庭月收入',
          code: 'Q6',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          list: [
            {
              answer: '1万元以下',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '1-2万元',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '2-3万元',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '3万元以上',
              code: 'D',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: '请选择您的个人月收入',
          code: 'Q7',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          list: [
            {
              answer: '1万元以下',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '1-2万元',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '2-3万元',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '3万元以上',
              code: 'D',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: '请选择您的支付形式',
          code: 'Q8',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          list: [
            {
              answer: '全款支付',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '分期付款',
              code: 'B',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: '请选择您的使用场景',
          code: 'Q9',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          list: [
            {
              answer: '自己使用为主',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '夫妻或情侣共同使用为主',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '夫妻带孩子使用为主',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '大家庭使用(与孩子,父母等)',
              code: 'D',
              type: 'check',
              checked: false
            },
            {
              answer: '商务接待为主',
              code: 'E',
              type: 'check',
              checked: false
            },
            {
              answer: '网约车',
              code: 'F',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: '您购车属于以下哪种情况',
          code: 'Q10',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          list: [
            {
              answer: '首次购车',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '增购',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '置换现有车型',
              code: 'C',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: '如您是增购车辆',
          code: 'Q11',
          selectType: 'single', // single 单选； multi 多选
          must: false, // 必填
          checked: '',
          disabled: false,
          list: [
            {
              no: 'Q11',
              answer: '请注明家中已有的车型',
              code: '',
              type: 'input',
              checked: false,
              value: ''
            }
          ]
        },
        {
          question: '如您是置换车辆',
          code: 'Q12',
          selectType: 'single', // single 单选； multi 多选
          must: false, // 必填
          checked: '',
          disabled: false,
          list: [
            {
              no: 'Q12',
              answer: '请注明此次置换要替换的车型',
              code: '',
              type: 'input',
              checked: false,
              value: ''
            }
          ]
        },
        {
          question: '请选择您对比过的车型(多选)',
          code: 'Q13',
          selectType: 'multi', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          disabled: false,
          list: [
            {
              answer: '奥迪A4L',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '宝马3系',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '奔驰C级',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '雷克萨斯ES',
              code: 'D',
              type: 'check',
              checked: false
            },
            {
              answer: '迈腾',
              code: 'E',
              type: 'check',
              checked: false
            },
            {
              answer: '凯美瑞',
              code: 'F',
              type: 'check',
              checked: false
            },
            {
              answer: '帕萨特',
              code: 'G',
              type: 'check',
              checked: false
            },
            {
              answer: '雅阁',
              code: 'H',
              type: 'check',
              checked: false
            },
            {
              answer: '天籁',
              code: 'I',
              type: 'check',
              checked: false
            },
            {
              answer: '君越',
              code: 'J',
              type: 'check',
              checked: false
            },
            {
              answer: '君威',
              code: 'K',
              type: 'check',
              checked: false
            },
            {
              answer: '吉利博瑞GE',
              code: 'L',
              type: 'check',
              checked: false
            },
            {
              answer: 'WEY P8',
              code: 'M',
              type: 'check',
              checked: false
            },
            {
              answer: '比亚迪秦100',
              code: 'N',
              type: 'check',
              checked: false
            },
            {
              answer: '荣威ei6',
              code: 'O',
              type: 'check',
              checked: false
            },
            {
              answer: '广汽传祺GS4 PHEV',
              code: 'P',
              type: 'check',
              checked: false
            },
            {
              answer: '名爵eMG6',
              code: 'Q',
              type: 'check',
              checked: false
            },
            {
              answer: '其他',
              code: 'R',
              type: 'input',
              checked: false
            }
          ]
        },
        {
          question: '您认为选购车型最吸引您的是下述哪几项（多选）',
          code: 'Q14',
          selectType: 'multi', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          disabled: false,
          list: [
            {
              answer: 'TNGA平台',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '混合动力',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '大胆动感的外观与精致豪华的内饰',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '强劲有力的行驶性能与操控',
              code: 'D',
              type: 'check',
              checked: false
            },
            {
              answer: '静谧性和稳定性',
              code: 'E',
              type: 'check',
              checked: false
            },
            {
              answer: '全尺寸大空间',
              code: 'F',
              type: 'check',
              checked: false
            },
            {
              answer: '环保低油耗',
              code: 'G',
              type: 'check',
              checked: false
            },
            {
              answer: '先进的科技与人性化科技配置',
              code: 'H',
              type: 'check',
              checked: false
            },
            {
              answer: '豪华安全配置（包含TSS）',
              code: 'I',
              type: 'check',
              checked: false
            },
            {
              answer: '多模驾控',
              code: 'J',
              type: 'check',
              checked: false
            },
            {
              answer: '超长续航',
              code: 'K',
              type: 'check',
              checked: false
            },
            {
              answer: '技术领先',
              code: 'L',
              type: 'check',
              checked: false
            },
            {
              answer: '值得信赖的品牌',
              code: 'M',
              type: 'check',
              checked: false
            },
            {
              answer: '其他',
              code: 'N',
              type: 'input',
              checked: false,
              value: ''
            }
          ]
        },
        {
          question: '对于下列技术术语，您的了解程度是？',
          explain: '① TNGA ',
          code: 'Q15',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          explainMsg: '(1) TNGA:',
          list: [
            {
              answer: '熟悉',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '知道',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '听过',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '不知道',
              code: 'D',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: 'Q15TSS',
          explain: ' ② TSS ',
          code: 'Q15',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          explainMsg: '(2) TSS:',
          list: [
            {
              answer: '熟悉',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '知道',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '听过',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '不知道',
              code: 'D',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: 'Q15HEV',
          explain: '③ HEV ',
          code: 'Q15',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          explainMsg: '(3) HEV:',
          list: [
            {
              answer: '熟悉',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '知道',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '听过',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '不知道',
              code: 'D',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: 'Q15AVS',
          explain: '④ AVS ',
          code: 'Q15',
          selectType: 'single', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          explainMsg: '(4) AVS:',
          list: [
            {
              answer: '熟悉',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '知道',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '听过',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '不知道',
              code: 'D',
              type: 'check',
              checked: false
            }
          ]
        },
        {
          question: '您对新车的上市信息获取渠道是?(多选题)',
          code: 'Q16',
          selectType: 'multi', // single 单选； multi 多选
          must: true, // 必填
          checked: '',
          disabled: false,
          list: [
            {
              answer: '汽车类垂直网站',
              code: 'A',
              type: 'check',
              checked: false
            },
            {
              answer: '网易，新浪、SOHU等门户网站',
              code: 'B',
              type: 'check',
              checked: false
            },
            {
              answer: '微信朋友圈',
              code: 'C',
              type: 'check',
              checked: false
            },
            {
              answer: '广播',
              code: 'D',
              type: 'check',
              checked: false
            },
            {
              answer: '电梯广告',
              code: 'E',
              type: 'check',
              checked: false
            },
            {
              answer: '户外广告',
              code: 'F',
              type: 'check',
              checked: false
            },
            {
              answer: '报纸',
              code: 'G',
              type: 'check',
              checked: false
            },
            {
              answer: '经销店告知',
              code: 'H',
              type: 'check',
              checked: false
            },
            {
              answer: '朋友推荐',
              code: 'I',
              type: 'check',
              checked: false
            },
            {
              answer: '机场',
              code: 'J',
              type: 'check',
              checked: false
            },
            {
              answer: '电视',
              code: 'K',
              type: 'check',
              checked: false
            },
            {
              answer: '车展及城市发布会',
              code: 'L',
              type: 'check',
              checked: false
            },
            {
              answer: '其他',
              code: 'M',
              type: 'input',
              checked: false,
              value: ''
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    // 选择
    doCheck(obj, item) {
      let t = this
      if (obj.selectType === 'multi') {
        // 多选
        item.checked = !item.checked
        let checkAry = []
        _.each(obj.list, (answer, key) => {
          if (answer.checked) {
            checkAry.push(answer)
          }
        })
        if (checkAry.length > 0) {
          obj.checked = checkAry
        } else {
          obj.checked = ''
        }
      } else {
        // 单选
        if (item.checked) {
          item.checked = false
          obj.checked = ''
        } else {
          _.each(obj.list, (answer, key) => {
            if (answer.code === item.code) {
              answer.checked = true
              item.checked = true
              obj.checked = item
            } else {
              answer.checked = false
            }
          })
        }
      }

      // 第1题选择了A，第二题不能选；
      // 第10题选择了A则12、13题不能输；
      // 第10题选择B则，12题为必输；
      // 第10题选择了C则，13题为必输；
      // 逻辑判断
      if (obj.code === 'Q1') {
        // 选择第1题
        _.each(t.questionnaireList, (answer, key) => {
          if (answer.code === 'Q2') {
            // 第二题
            if (item.code === 'A') {
              answer.must = !item.checked
              answer.disabled = true
            } else {
              answer.must = true
            }
          }
        })
      } else if (obj.code === 'Q10') {
        // 选择第10题
        _.each(t.questionnaireList, (answer, key) => {
          if (answer.code === 'Q11') {
            // 第二题
            if (item.code === 'A') {
              answer.must = false
              answer.disabled = true
            } else if (item.code === 'B') {
              answer.must = true
              answer.disabled = false
            } else if (item.code === 'C') {
              answer.must = false
              answer.disabled = false
            }
          }

          if (answer.code === 'Q12') {
            // 第二题
            if (item.code === 'A') {
              answer.must = false
              answer.disabled = true
            } else if (item.code === 'B') {
              answer.must = false
              answer.disabled = false
            } else if (item.code === 'C') {
              answer.must = true
              answer.disabled = false
            }
          }
        })
      }
    },
    // 关闭弹窗
    doClose() {
      let t = this
      t.$emit('close', {
        type: 'close',
        show: false
      })
    },
    // 提交问卷
    doSubmit() {
      let t = this
      let resultObj = {
        no: '',
        answerCode: '',
        type: '',
        complete: true
      }
      let answerList = [] // must: true
      let index = 0
      _.each(t.questionnaireList, (answer, key) => {
        let answerObj = {
          // 拼接答案项
          name: answer.question,
          code: answer.code,
          answerAndCode: []
        }
        if (index >= 15 && index < 18) {
          answerObj = answerList[14]
        }
        if (answer.checked !== '') {
          // 选择了答案
          if (
            Object.prototype.toString.call(answer.checked) === '[object Array]'
          ) {
            // 多选
            _.each(answer.checked, (answerItem, key) => {
              if (answerItem.type === 'check') {
                answerObj.answerAndCode.push(
                  answerItem.code + '. ' + answerItem.answer
                )
              } else if (answerItem.value !== '') {
                answerObj.answerAndCode.push(
                  answerItem.code + '. 其他:' + answerItem.value
                )
              } else {
                // 选择其他，但未填答案
                if (answer.must && resultObj.complete) {
                  resultObj = {
                    no: answer.code,
                    answerCode: answerItem.code,
                    type: answerItem.type,
                    complete: false
                  }
                }
              }
            })
          } else {
            // 单选
            if (answer.checked.type === 'check') {
              console.info(answerObj.answerAndCode)
              if (answer.explainMsg) {
                answerObj.answerAndCode.push(
                  answer.explainMsg +
                  answer.checked.code +
                  '. ' +
                  answer.checked.answer
                )
              } else {
                answerObj.answerAndCode.push(
                  answer.checked.code + '. ' + answer.checked.answer
                )
              }
            } else if (answer.checked.value !== '') {
              if (answer.checked.no === 'Q11' || answer.checked.no === 'Q12') {
                answerObj.answerAndCode.push(answer.checked.value)
              } else {
                answerObj.answerAndCode.push(
                  answer.checked.code + '. 其他:' + answer.checked.value
                )
              }
            } else {
              // 选择其他，但未填答案
              if (answer.must && resultObj.complete) {
                resultObj = {
                  no: answer.code,
                  answerCode: answer.checked.code,
                  type: answer.checked.type,
                  complete: false
                }
              }
            }
          }
        } else if (answer.list.length === 1) {
          // 一个答案项 （填写题）
          if (answer.list[0].value !== '') {
            answerObj.answerAndCode.push(answer.list[0].value)
          } else {
            // 答案项为空
            if (answer.must && resultObj.complete) {
              resultObj = {
                no: answer.code,
                answerCode: answer.list[0].code,
                type: answer.list[0].type,
                complete: false
              }
            }
          }
        } else {
          // 未选择
          if (answer.must && resultObj.complete) {
            resultObj = {
              no: answer.code,
              answerCode: '',
              type: '',
              complete: false
            }
          }
        }
        if (index < 15 || index > 17) {
          answerList.push(answerObj)
        }
        index = index + 1
      })

      // console.log('answerList:>', answerList)
      // console.log('resultObj:>', resultObj)
      if (!resultObj.complete) {
        if (resultObj.type) {
          if (resultObj.no === 'Q11' || resultObj.no === 'Q12') {
            t.$toast('请完善题' + resultObj.no + '的说明再提交')
          } else {
            t.$toast('请完善题' + resultObj.no + '的"其他"说明再提交')
          }
        } else {
          t.$toast('题' + resultObj.no + '未填写，请完成后再提交')
        }
      } else {
        t.questionComplete = true
        t.$emit('close', {
          type: 'congratulations',
          show: true
        })
        Request.insertQuestionnaire({
          ACCESS_TOKEN: t.userObj.data.token,
          orderNo: t.orderNo,
          questionnaireInfo: answerList
        }).then(result => {
          if (result.success) {
            t.questionComplete = true
            t.$emit('close', {
              type: 'congratulations',
              show: true
            })
          } else if (result.code === '-10') {
            t.$messageBox.confirm('登录失效，是否重新登录?').then(
              action => {
                t.syncLoadLayer({
                  type: 'login',
                  show: true
                })
              },
              cancel => {
                t.$common.clearUserInfo()
                t.$router.replace('/wx')
              }
            )
          } else {
            t.$toast(result.msg)
          }
        })
      }
    }
  },
  watch: {
    // 监听show改变
    show(val) {
      this.questionnairePopupVisible = val
    },
    questionnairePopupVisible(val) {
      if (!val && !this.questionComplete) {
        // eslint-disable-next-line no-undef
        $('.bm-content').css({ 'overflow-y': 'auto' })
        this.$emit('close', {
          type: 'questionnaire',
          show: val
        })
      } else {
        // eslint-disable-next-line no-undef
        $('.bm-content').css({ 'overflow-y': 'hidden' })
      }
    }
  }
}
</script>
<style lang="scss">
@import "./sass/questionnaire-survey";
</style>
