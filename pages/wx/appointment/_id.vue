<template>
  <!--预约试驾-->
  <div class="match-container">
    <!--头部-->
    <div class="match-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div class="header-left"></div>
      <!-- <i @click="fullPopupShow = false" class="iconfont icon-back"></i> -->
      <div class="bm-flex header-title" v-if="shijiaorzixun">预约试驾</div>
      <div class="bm-flex header-title" v-else>预约咨询</div>
      <div class="header-right"></div>
    </div>
    <!--预约车型-->
    <div class="distributor">
      <div class="distributor-title">选择车型</div>
      <div @click="catelogShow = !catelogShow" class="city-select">
        <span>{{catelogs.selected.proCatalogName || '请选择'}}</span>
        <i class="iconfont icon-down-min"></i>
      </div>
      <div @click="productShow = !productShow" class="city-select" style="margin-left:2px">
        <span>{{productObj.selected.productName || '请选择'}}</span>
        <i class="iconfont icon-down-min"></i>
      </div>
    </div>

    <!--经销商-->
    <div class="distributor">
      <div class="distributor-title">经销商查询</div>
      <!--<div class="distributor-tip">根据您的定位，我们给您推荐了最近三家的经销商门店，您还可以通过右侧的快速查询来选择</div>-->
      <!--省-->
      <div @click="provinceShow = !provinceShow" class="province-select">
        <span>{{provinceObj.selected.name || ''}}</span>
        <i class="iconfont icon-down-min"></i>
      </div>
      <!--市-->
      <div @click="cityShow = !cityShow" class="city-select">
        <span>{{cityObj.selected.name || ''}}</span>
        <i class="iconfont icon-down-min"></i>
      </div>
      <!-- <div class="distributor-search bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex edit quickCheck">
          <input v-model="dealerName" placeholder="输入经销商名称快速查询"/>
        </div>
        <div @click="doSearch" class="search-btn"><i class="iconfont icon-search"></i></div>
      </div>-->
      <!--特约店-->
      <!-- <ul class="special-shop-list">
        <li @click="doDealerSelect(item)" v-for="(item, index) in dealerObj.list" :key="index"
            class="shop-item bm-box bm-box-horizontal"
            :class="{'checked':item.active}">
          <div class="icon"><i class="iconfont" :class="item.active? 'icon-check-full':'icon-check-empty'"></i></div>
          <div class="bm-flex name">{{item.dealerName}}</div>
        </li>
      </ul>-->
      <!--查看更多-->
      <!-- <div @click="showMore = !showMore" v-show="dealerObj.list.length>2" class="open-more">
        {{showMore? '收起展开':'展开更多'}}<i class="iconfont" :class="showMore? 'icon-up-min':'icon-down-min'"></i>
      </div>-->
      <!-- 店名 -->
      <i class="iconfont icon-down-min" style="position: absolute;top: 5.8rem;right: 0.8rem;z-index: 9;"></i>
      <el-autocomplete
        popper-class="my-autocomplete"
        v-model="state3"
        :fetch-suggestions="querySearch"
        :placeholder="placeholderState"
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <div class="name" :class="item.dealerName === reState3 ? 'reCheck' : ''">{{ item.dealerName }}</div>
          <span class="addr" :class="item.dealerName === reState3 ? 'reCheck' : ''">{{ item.address }}</span>
        </template>
      </el-autocomplete>
      <!-- 地址 -->
      <div class="personInfo" style="margin-top:0px">
        <div class="personInfo-content">
          <input style="width:100%" v-model="address" maxlength="11" disabled placeholder="地址">
        </div>
      </div>
      <!-- 个人信息 -->
      <div class="personInfo">
        <div class="personInfo-title">个人信息</div>
        <div class="personInfo-content">
          <input v-if="form.hasName" v-model="form.name" type="text" disabled placeholder="姓名">
          <input v-else v-model="form.name" type="text" placeholder="姓名">
          <input type="radio" name="sex" value="0" v-model="sex">先生
          <input type="radio" name="sex" value="1" v-model="sex">女士
        </div>
        <div class="personInfo-content">
          <input v-model="form.phone" maxlength="11" type="number" disabled placeholder="手机号">
        </div>
      </div>

      <!-- 试驾时间 -->
      <div class="personInfo driveDate">
        <div class="personInfo-title" v-if="shijiaorzixun">试驾时间</div>
        <div class="personInfo-title" v-else>到店时间</div>
        <!-- <div class="personInfo-content sel_date">
            <div @click="openPicker" type="text" class="test-time" placeholder="选择日期">{{testTime || '选择日期'}}</div>
        </div>-->
        <el-date-picker
          style="width:370px;"
          v-model="time"
          type="date"
          :picker-options="pickerOptions"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <!-- 计划购车时间 -->
      <div class="buryCarTime">
        <div class="buryCarTitle">计划购车时间</div>
        <ul>
          <li v-for="plan in sysCode">
            <input type="radio" name="planTime" v-model="planTimeString" :value="plan.codeNo">
            {{plan.codeValue}}
          </li>
        </ul>
      </div>
      <div class="protocol">
        <input id="awesome_'+i+'" type="checkbox" @click="readShow">
        <label for="awesome_'+i+'"></label> 我已阅读并同意
        <b @click="show()">《隐私政策》</b>
      </div>
    </div>

    <!-- <div class="intentional-gold">
      <div class="lift-man-title">个人信息</div>
      <div class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex edit drive">
          <input v-model="form.name" type="text" disabled placeholder="姓名"/>
          <input type="radio" name="sex" value="0" v-model="sex"/>男
          <input type="radio" name="sex" value="1" v-model="sex"/>女
        </div>
      </div>
      <div class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex drive">
          <input type="radio" name="sex" value="0" v-model="sex"/>
        </div>
      </div>
      <div class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex edit drive">
          <input v-model="form.phone" maxlength="11" type="number" disabled placeholder="手机号"/>
        </div>
      </div>
    </div>-->
    <!-- <div class="intentional-gold">
      <div class="lift-man-title">试驾时间</div>
      <div class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="bm-flex edit drive">
          <input v-model="testTime" @click="openPicker" type="text" placeholder="选择日期"/>
        </div>
      </div>
    </div>-->
    <!-- <div class="intentional-gold">
      <div class="lift-man-title">预约信息</div>
      <div class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="label">填写您的姓名：</div>
        <div class="bm-flex edit drive">
          <input v-model="form.name" type="text" disabled placeholder="姓名"/>
        </div>
      </div>
      <div class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="label">选择您的性别：</div>
        <div class="bm-flex drive">
          <input type="radio" name="sex" value="0" v-model="sex"/>男
          <input type="radio" name="sex" value="1" v-model="sex"/>女
        </div>
      </div>
      <div class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="label">填写您的手机：</div>
        <div class="bm-flex edit drive">
          <input v-model="form.phone" maxlength="11" type="number" disabled placeholder="手机号"/>
        </div>
      </div>
      <div class="edit-intention bm-box bm-box-horizontal bm-box-vertical-center">
        <div class="label">预约试驾时间：</div>
        <div class="bm-flex edit drive">
          <input v-model="testTime" @click="openPicker" type="text" placeholder="选择日期"/>
        </div>
      </div>
      <div class="plan-time">
        计划购车时间：
        <ul>
          <li v-for="plan in sysCode">
            <input type="radio" name="planTime" v-model="planTimeString" :value="plan.codeNo"/>{{plan.codeValue}}
          </li>
        </ul>
      </div>
    </div>-->
    <!--提交按钮-->
    <div @click="toSubmit" class="submit-btn">
      <i class="iconfont icon-do-selected"></i>马上预约
    </div>
    <div style="font-size:0.32rem;color:#7f7f7f;text-align:center;margin-top:0.53rem;">
     <!-- 一汽丰田感谢您在线预约试驾，您预约的经销店会尽快与您联络<br/>具体试驾时间及车型，请与经销店协商 -->
     <!-- 一汽丰田感谢您预约试驾，预约的经销店会尽快与您联络，<br/>具体试驾时间及车型，请与经销店协商。 -->
    </div>
    <!--省-->
    <common-select
      :show.sync="provinceShow"
      :options="provinceObj.selectList"
      :type="'province'"
      @changed="selectedChanged"
    ></common-select>
    <!--市-->
    <common-select
      :show.sync="cityShow"
      :options="cityObj.selectList"
      :type="'city'"
      @changed="selectedChanged"
    ></common-select>
    <!--车系-->
    <common-select
      :show.sync="catelogShow"
      :options="catelogs.selectList"
      :type="'catelogs'"
      @changed="selectedChanged"
    ></common-select>
    <!--车型-->
    <common-select
      :show.sync="productShow"
      :options="productObj.selectList"
      :type="'product'"
      @changed="selectedChanged"
    ></common-select>
    <!--预约时间-->
    <mt-datetime-picker
      v-model="testTime"
      ref="picker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
      :startDate="startDate"
    ></mt-datetime-picker>
    <mt-popup class="agreement-layer" v-model="agreementPopupVisible" popup-transition="popup-fade">
      <div class="agreement-content">
        <!--隐私政策-->
        <h4 class="agreement-title">隐私政策</h4>
        <!--注册协议-->
        <div class="agreement-text">
          <p>一汽丰田顾客个人信息保护基本方针</p>
          <p>一汽丰田汽车销售有限公司(以下简称“一汽丰田销售”)、一汽丰田销售认定的经销商（以下简称 “一汽丰田经销商”）及其各自的关联公司（包括但不限于其各自的母公司、车辆的制造公司及丰田汽车（中国）投资有限公司）（以下将“一汽丰田销售”、“一汽丰田经销商”及其各自的关联公司统称为“一汽丰田”）认为严格遵守个人信息保护相关的中国法律法规，妥善处理顾客个人姓名、地址、电话号码、邮箱地址等 能够识别顾客个人及其家庭成员身份的信息（以下简称“个人信息”），是企业重要的社会责任。基于此，“一汽丰田”制定了如下的保护个人信息基本方针。</p>

          <h5>1.个人信息的取得</h5>
          <p>1)“一汽丰田”于以下情形取得个人信息：</p>
          <p>① 销售产品、提供服务时取得的个人信息；</p>
          <p>② 为了提供问询对应等取得的个人信息（包括使用来电显示取得的联系方式）；</p>
          <p>③ 实施各项调查（包括“一汽丰田”委托外部公司实施的）时取得的个人信息；</p>
          <p>④ “一汽丰田”取得的其他个人信息。</p>
          <p>2)“一汽丰田”将在取得顾客的同意后，取得其个人信息。</p>

          <h5>2.个人信息的处理</h5>
          <p>1）关于个人信息的使用</p>
          <p>“一汽丰田”根据前述第1.条规定取得的个人信息，将仅在“一汽丰田”内部根据需要进行共享，并且仅为以下目的或其他合法、正当的目的使用：</p>
          <p>① 与顾客进行的交易；</p>
          <p>② 商品及服务的企划、开发、改善；</p>
          <p>③ 发送与“一汽丰田”的产品、服务、宣传活动（包括但不限于汽车、保险等）相关的信息或通知；</p>
          <p>（但在未取得顾客同意的情况下，我们不会发送商业性目的的上述信息或通知）</p>
          <p>④ 在产品企划、开发或提高服务质量及顾客满意度等方面，实施的各项调查；</p>
          <p>⑤ 顾客问询、联系“一汽丰田经销商”及丰田顾客服务中心时，进行迅速的对应；</p>
          <p>⑥ 根据法律规定或政府机关、法院、调解机构、仲裁机构等的通知、指导等而采取的对应；</p>
          <p>⑦ 其他取得个人信息时所明示的使用目的。</p>
          <p>2）向第三方提供个人信息</p>
          <p>“一汽丰田”根据前述第1.条规定取得的个人信息，在未取得顾客同意的情况下，不会向第三方提供或出售。但是，为了实现上述使用目的，在必要的范围内，会提供给业务受托方。于此情形下，“一汽丰田”会要求业务受托方妥当处理“一汽丰田”所提供的个人信息，并进行妥善管理。</p>
          <p>3）妥善管理个人信息</p>
          <p>为了对个人信息严格保密，防止不正当接触个人信息，防止个人信息丢失、损坏、被篡改、泄露等，“一汽丰田”采取了妥善的安全措施，并且将在因前述事由导致事故后采取救济措施。</p>

          <h5>3.问询等</h5>
          <p>关于个人信息的相关问询，请就近联系“一汽丰田经销商”或“一汽丰田顾客服务中心”。“一汽丰田”将严格遵守个人信息保护相关的中国法律法规，进行妥善处理。</p>
          <p>·关于就近的“一汽丰田经销商”</p>
          <p>【https://m.ftms.com.cn/buycar/chaxunjxs】</p>
          <p>·“一汽丰田顾客服务中心”</p>
          <p>【电话：800-810-1210，400-810-1210】</p>

          <h5>4.遵纪守法与改善</h5>
          <p>“一汽丰田”将严格遵守个人信息保护相关的中国法律法规，并为了妥善处理个人信息而进行持续性的改善，并会将改善内容随时体现在本基本方针中。</p>
        </div>
      </div>
      <!--关闭按钮-->
      <div @click="agreementPopupVisible = false" class="close-btn">
        <i class="iconfont icon-guanbi"></i>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import Request from '~/plugins/request'
import BaiduMap from '~/components/common/map.js'
import commonSelect from '~/components/common/layer/common-select.vue'
import termsService from '~/components/common/layer/terms-service.vue'

export default {
  name: 'appointment',
  components: {
    commonSelect,
    termsService,
    BaiduMap
  },
  data() {
    return {
      fullPopupShow: false,
      provinceShow: false,
      shijiaorzixun:true,//预约是true,咨询false
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
      // 店名
      restaurants: [],
      state3: '',
      dealerName: '',
      reState3: '',
      placeholderState: '店名',
      // 地址
      address: '',
      time: '',
      dealerObj: {
        // 经销商列表
        selected: {},
        list: [],
        baseList: []
      },
      showMore: false, // 显示更多
      form: {
        name: '',
        phone: '',
        time: '',
        hasName: false
      },
      catelogShow: false,
      catelogs: {
        selected: {},
        selectList: [],
        list: [],
        index: '',
        defaultIndex: ''
      },
      productShow: false,
      productObj: {
        selected: {},
        selectList: [],
        list: [],
        index: '',
        defaultIndex: ''
      },
      testTime: null,
      startDate: new Date(),
      sysCode: [],
      planTimeString: '',
      sex: '0',
      agreementPopupVisible: false,
      readShowSubmit: true,
      flag: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  mounted() {
    let t = this
    t.origin = t.$cache.origin.get() || '' // 存储来源
    //console.log('origin:>', t.origin)
    t.getSysCodeValues()
    if (!t.userObj.logined) {
      // 获取登录信息
      let userObj = t.$common.getUserInfo() || ''
      if (userObj === '') {
        userObj = t.$common.getUnLoginData()
      }
      if (!userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录失效，是否重新登录?').then(
          action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          },
          cancel => {
            t.$common.clearUserInfo()
            t.$router.go(-1)
          }
        )
      } else {
        // 异步调用
        ; (async () => {
          try {
            await t.$store.dispatch('doLogin', userObj)
            await t.$store.dispatch('getUserInfo', t.userObj.data)
            setTimeout(() => {
              const name =
                t.userObj.data.realName || t.userObj.data.loginName || ''
              t.form = {
                name,
                phone: t.userObj.data.mobile || '',
                hasName: name !== ''
              }
            }, 300)
          } catch (error) {
            //console.log(error)
          }
        })()
      }
    } else {
      t.$store.dispatch('getUserInfo', t.userObj.data)
      setTimeout(() => {
        t.form = {
          name: t.userObj.data.loginName || t.userObj.data.realName || '',
          phone: t.userObj.data.mobile || ''
        }
      }, 200)
    }
    t.getRegionInfo('0', prov => {
      // 获取区域信息
      // t.getRegionInfo(prov.regionId)
      t.selectedChanged({
        show: false,
        type: 'province',
        value: t.position.provinceName
      })
      t.getRegionInfo(t.position.provinceId)
      setTimeout(() => {
        t.selectedChanged({
          show: false,
          type: 'city',
          value: t.position.cityName
        })
      }, 200)
    })
    t.getProCatalogByParentId(catelog => {
      t.getProductByProCatalogId(catelog.proCatalogId)
    })
    setTimeout(() => {
      t.$util.win.goTop() // 回到顶部
    }, 400)

    // this.queryDealerList()
  },
  created() {
    // disabledDate 为true表示不可选,false表示可选
  },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user,
      position: state => state.user.position
    })
  },
  methods: {
    readShow(obj) {
      this.readShowSubmit = !obj.target.checked
    },
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
            t.queryDealerList() // 获取经销商列表信息
          }
        }
      })
    },
    // 搜索
    doSearch() {
      this.queryDealerList() // 获取经销商列表信息
    },
    // 选择器选中值改变
    selectedChanged(obj) {
      let t = this
      if (obj.type === 'earnest') {
        // 商品意向金
        t.productEarnestShow = obj.show
        _.each(t.productEarnestObj.list, (item, key) => {
          if (obj.value === item.codeValue) {
            t.productEarnestObj.selectList.defaultIndex = key
            t.productEarnestObj.selected = item
          }
        })
      } else if (obj.type === 'province') {
        t.provinceShow = obj.show
        _.each(t.provinceObj.list, (item, key) => {
          if (obj.value === item.name) {
            t.provinceObj.selectList.defaultIndex = key
            t.provinceObj.selected = item
            t.getRegionInfo(item.regionId) // 获取城市列表
          }
        })
        // 切换省后，置空前次的经销商信息
        t.state3 = '' 
        t.placeholderState = '店名'
        t.address = ''
      } else if (obj.type === 'city') {
        t.cityShow = obj.show
        _.each(t.cityObj.list, (item, key) => {
          if (obj.value === item.name) {
            t.cityObj.selectList.defaultIndex = key
            t.cityObj.selected = item
            t.doSearch()
            t.state3 = ''
            t.placeholderState = '店名'
            t.address = ''
          }
        })
      } else if (obj.type === 'shop') {
        t.shopShow = obj.show
        _.each(t.shopObj.list, (item, key) => {
          if (obj.value === item.name) {
            t.shopObj.selectList.defaultIndex = key
            t.shopObj.selected = item
            // t.doSearch()
          }
        })
       // console.log(t.shopObj.selected)
      } else if (obj.type === 'catelogs') {
        t.catelogShow = obj.show
       // console.log('-------------',t.catelogs.list)
        _.each(t.catelogs.list, (item, key) => {
          if (obj.value === item.proCatalogName) {
            t.catelogs.selectList.defaultIndex = key
            t.catelogs.selected = item
            t.getProductByProCatalogId(item.proCatalogId)
          }
        })
      } else if (obj.type === 'product') {
        t.productShow = obj.show
        _.each(t.productObj.list, (item, key) => {
        //  console.log(obj.show)
          if (obj.value === item.productName) {
            t.productObj.selectList.defaultIndex = key
            t.productObj.selected = item
          }
        })
      } else if (obj.type.indexOf('select_') >= 0) {
        let sort = Number(obj.type.split('select_')[1])
        t.attributeLists[sort - 1].selectShow = false
        let attrArray = []
        _.each(t.attributeLists, (attr, index) => {
          let attributeValueBOList = attr.attributeValueBOList || []
          _.each(attributeValueBOList, (item, key) => {
            item['attributeValue'] = item.attributeValue || ''
            if (item.attributeValue === obj.value) {
              attr.selectList.defaultIndex = key
              attr.selected = item
            }
          })
          attrArray.push(attr.selected.attributeScopeId || '')
        })
        //console.log('attrArray:>', attrArray)
        t.queryGoodsInfoList(t.goods.productId, attrArray) // 查询单品列表
      }
    },
    // 选择经销商
    // doDealerSelect(obj) {
    //   let t = this
    //   _.each(t.dealerObj.list, (item, key) => {
    //     if (obj.dealerId === item.dealerId) {
    //       item.active = true
    //       t.dealerObj.baseList[key].active = true
    //       t.dealerObj.selected = item
    //     } else {
    //       item.active = false
    //       t.dealerObj.baseList[key].active = false
    //     }
    //   })
    // },
    // 隐藏弹出层
    doClose(obj) {
      let t = this
      if (obj.type === 'terms-service') {
        t.termsServiceLayerShow = false
      }
    },
    // 获取经销商列表信息
    queryDealerList() {
      let t = this
      t.dealerObj = {
        selected: {},
        list: [],
        baseList: []
      }
      t.purchaseCheck = false
      t.purchaseNo = ''
      Request.queryDealerList({
        provinceId: t.provinceObj.selected.regionId || '',
        cityId: t.cityObj.selected.regionId || '',
        dealerName: t.dealerName
      }).then(result => {
        if (result.success) {
          // console.log('result:>', result)
          this.restaurants = result.data
          // address: "广州市天河区石牌黄埔大道西483号"
          // dealerId: 112
          // dealerName: "广州广保"
          // lat: 23.132332
          // lng: 113.348057
          // phoneSeal: "020-62320180"
          // phoneService: "020-38909632"
          let dataList = result.data || []
          if (dataList.length > 0) {
            _.each(dataList, (item, key) => {
              item['active'] = key === 0
              if (key < 3) {
                // 默认显示3个
                t.dealerObj.list.push(item)
              }
              t.dealerObj.baseList.push(item)
            })
            t.dealerObj.selected = t.dealerObj.list[0]
          }
        }
      })
    },
    // 获取类目信息
    getProCatalogByParentId(callback) {
      const t = this
      Request.getProCatalogByParentId('', '1').then(result => {
        if (result.success) {
          // const dataList = result.data
          let datalist=[];
          if(t.$route.query.productId == 12597 || t.$route.query.productId == 12600 || t.$route.query.productId == 12601){
            t.shijiaorzixun=false;//咨询
          }else{
            t.shijiaorzixun=true;//试驾
          }
          // t.$route.query.proCatalogId
          if(t.shijiaorzixun){//试驾
            for (let i in result.data) {
              if(result.data[i].proCatalogId !== 1244 && result.data[i].proCatalogId !== 1248){
                datalist.push(result.data[i]);
              }
           }
           for(let j in datalist){
             if (datalist[j].proCatalogId == t.$route.query.proCatalogId) {
                  t.catelogs.index = datalist[j]
                  t.catelogs.defaultIndex = parseInt(j)
                  break
              }
           }
          }else{
             for (let i in result.data) {
              if(result.data[i].proCatalogId == 1244 || result.data[i].proCatalogId == 1248){
                datalist.push(result.data[i]);
              }
            }
            for(let j in datalist){
              if (datalist[j].proCatalogId == t.$route.query.proCatalogId) {
                    t.catelogs.index = datalist[j]
                    t.catelogs.defaultIndex = parseInt(j)
                    break
                }
            }
          }
          
          let valuesList = []
          _.each(datalist, (item, key) => {
            valuesList.push(item.proCatalogName)
          })
          t.catelogs = {
            selected: t.catelogs.index,
            selectList: [
              {
                flex: 1,
                values: valuesList,
                defaultIndex: t.catelogs.defaultIndex, // 默认值
                className: 'slot-1',
                textAlign: 'center'
              }
            ],
            list: datalist
          }
          if (callback) {
            callback(t.catelogs.selected)
          }
        }
      })
    },
    getProductByProCatalogId(proCatelogId) {
     // console.log('getProductByProCatalogIdREQESTOK')
      const t = this
      Request.getProductByProCatalogId(proCatelogId).then(result => {
        if (result.success) {
        //  console.log('res==', result)
          // 威尔法不显示在预约下拉列表里datalist_w是去掉威尔法的dataList是全部
          const dataList = result.data
          let datalist_w = [];
          for(let j in result.data){
            // if(result.data[j].productId !== 12597 && result.data[j].productId !== 12600 && result.data[j].productId !== 12601){
              datalist_w.push(result.data[j])
            // }
          }
          if (t.flag) {
            for (let i in datalist_w) {
              if (datalist_w[i].productId == t.$route.query.productId) {
                t.productObj.index = datalist_w[i]
                t.productObj.defaultIndex = parseInt(i)
                t.flag = false
                break
              }
            }
          } else {
            t.productObj.index = 0
            t.productObj.defaultIndex = 0
          }
          let valuesList = []
          _.each(datalist_w, (item, key) => {
            valuesList.push(item.productName)
          })
          t.productObj = {
            selected: t.productObj.index,
            selectList: [
              {
                flex: 1,
                values: valuesList,
                defaultIndex: t.productObj.defaultIndex, // 默认值
                className: 'slot-1',
                textAlign: 'center'
              }
            ],
            list: datalist_w
          }
        }
      })
    },
    openPicker() {
      this.$refs.picker.open()
    },
    handleConfirm(data) {
      let date = this.$util.Date.getFormatDate(data, 'day')
      this.testTime = date
    },
    // 提交订单
    toSubmit() {
      let t = this
      const dateValue = this.time.getFullYear() + '-' + (this.time.getMonth() + 1) + '-' + this.time.getDate()
      if (!t.userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录后才能预约试驾，是否登录?').then(
          action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          },
          cancel => {
            t.$common.clearUserInfo()
            t.$router.go(-1)
          }
        )
      } else {
        t.dealerObj.selected['dealerId'] = t.dealerObj.selected.dealerId || ''
        if (!t.dealerObj.selected.dealerId) {
          t.$toast('请选择经销商')
        } else if (!t.placeholderState && t.placeholderState !== '店名') {
          t.$toast('请选择经销商名称')
        } else if (!t.form.name) {
          t.$toast('请输入预约人姓名')
        } else if (!t.form.phone) {
          t.$toast('请输入预约人手机号码')
        } else if (
          t.form.phone &&
          !t.$util.Str.isMobilePhoneNum(t.form.phone)
        ) {
          t.$toast('您输入的手机号有误，请输入正确的手机号')
        } else if (!t.planTimeString) {
          t.$toast('请选择计划购车时间')
        } else if (t.readShowSubmit) {
          t.$toast('请同意隐私政策')
        } else {
          const data = {
            ACCESS_TOKEN: t.userObj.data.token,
            name: t.$util.Str.trim(t.form.name || ''), // 去掉 extractName前后空格
            mobile: t.form.phone, // 提车人手机号
            carSeries: t.catelogs.selected.proCatalogId,
            carModels: t.productObj.selected.productId,
            dealerId: t.dealerObj.selected.dealerId || '', // 经销商Id
            typeId: '2',
            driveDate: dateValue,
            planShoppingTime: t.planTimeString,
            sex: t.sex,
            driveFlag:t.shijiaorzixun?'1':'2'
          }
          Request.insertDrive(data).then(result => {
            if (result.success) {
              // t.$toast('预约试驾成功')
              t.$toast('预约成功')
              setTimeout(() => {
                t.$router.push('/wx/user/queryDriverList')
              }, 600)
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
                  t.$router.go(-1)
                }
              )
            } else if (result.code === '-1') {
              t.$toast(result.msg)
            } else {
              t.$toast(result.msg)
            }
          })
        }
      }
    },
    getSysCodeValues() {
      let t = this
      t.rangeList = []
      Request.getSysCodeValues('', 'plan_shopping_time').then(result => {
        if (result.success) {
         // console.log(result)
          let dataList = result.data || []
         // console.log(dataList)
          this.sysCode = dataList
        }
      })
    },
    show() {
      this.agreementPopupVisible = true
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.dealerName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    reset() {
      //console.log(6483972483927489327)
    },
    handleSelect(item) {
      // this.state3 = item.dealerName
      this.state3 = ''
      this.placeholderState = item.dealerName
      this.address = item.address
      this.dealerObj.selected = item
      this.reState3 = this.placeholderState
    },
    handleIconClick(ev) {
     // console.log(ev)
    }
  },
  watch: {
    // 定位改变
    position: {
      handler(newPosition, oldPosition) {
        let t = this
        t.getRegionInfo('0', prov => {
          // 获取区域信息
          // t.getRegionInfo(prov.regionId)
          t.selectedChanged({
            show: false,
            type: 'province',
            value: t.position.provinceName
          })
          t.getRegionInfo(t.position.provinceId)
          setTimeout(() => {
            t.selectedChanged({
              show: false,
              type: 'city',
              value: t.position.cityName
            })
          }, 300)
        })
      },
      immediate: true
    },
    // 显示更多
    showMore(val) {
      let t = this
      t.dealerObj.list = []
      _.each(t.dealerObj.baseList, (item, key) => {
        if (val) {
          t.dealerObj.list.push(item)
        } else {
          if (key < 3) {
            // 默认显示3个
            t.dealerObj.list.push(item)
          }
        }
      })
    },
    // 监听右侧弹出层变化
    fullPopupShow(val) {
      if (val) {
        this.resetFullPopupHeight() // 重设弹出层高度
      }
    }
  }
}
</script>
<style lang="scss" scoped>
//noinspection CssUnknownTarget
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}

@import "~/assets/sass/pages/book/match.scss";
</style>
<style>
/* .agreement-content{
  width:9rem;
  height:12rem;
  font-size:24px;
  overflow:scroll;
  position:relative;
  padding:0 0.15rem!important;
  
}
.agreement-title{
  font-size: 28px!important;
  font-weight: bold!important;
  text-align: center;
}
.close-btn{
  width:0.5rem;
  margin:0 auto !important;
} */
.reCheck {
  font-weight: 700;
  color: lightblue !important;
}
.el-input__inner {
  height: 65px !important;
  width: 670px !important;
  border: 2px solid #999999 !important;
  color: #b9b9b9 !important;
  font-size: 0.32rem !important;
  padding-left: 12px !important;
}
.el-input__inner:focus {
  border: 2px solid #999999 !important;
}
.el-autocomplete {
  border-color: #999999 !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  height: 65px !important;
}
.el-autocomplete-suggestion li {
  font-size: 30px !important;
}
.my-autocomplete li .addr {
  font-size: 25px !important;
}
.el-input__prefix {
  display: none !important;
}
.el-picker-panel,
.el-date-picker .el-picker-panel__content {
  width: 670px !important;
  margin: 0;
}
/* .el-picker-panel__content .el-date-table .el-date-table__row td {
  font-size: 20px;
} */
.el-date-table td,
.el-date-table th {
  width: 0.43rem;
  height: 0.4rem;
  text-align: center;
  font-size: 26px!important;
}
.el-date-table td span {
  width: 36px!important;
  height: 36px!important;
  line-height: 36px!important;
  font-size: 26px!important;
}
.el-date-picker__header-label {
  font-size: 26px!important;
}
.el-picker-panel__icon-btn {
  font-size: 26px!important;
}
</style>

