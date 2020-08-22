<template>
    <div class="modelTable">
        <!-- 设置暗锚点 -->
        <div id="an_configure" style="position: relative;top: -3.7rem;height: 0;overflow: hidden;"></div>

        <div class="titleBox" v-if="flag">
            <div class="headerTitle">参数配置</div>
            <!-- <div class="selsct" @click="clickVehicle">
                       {{vehicle[0]}}
                       <i class="iconfont" :class="popMenuShow? 'icon-up-min':'icon-down-min'"></i>
                       <div class="cloth" v-if="popMenuShow">
                           <ul v-for="(item,index) in vehicle" :key="index">
                               <li class="li" @click="choice(item,index)">{{item}}</li>
                           </ul>
                       </div>
            </div>-->
        </div>

        <div :class="{'modelTitleScroll' : scrollId}"></div>
        <div class="modelList modelTitle" id="scroll-id" :class="{'scroll' : scrollId}">
            <div class="model-left" v-if="flag">
                <div class="Box">
                    <div class="title">
                        <span>基本参数</span>
                    </div>
                    <table>
                        <tr>
                            <td valign="middle" class="config-td config-left oneHeight">型号</td>
                        </tr>
                        <tr>
                            <td valign="middle" class="config-td config-left">厂商建议零售价</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="model" v-if="flag" id="configure1" @scroll="scroll">
                <div class="Box">
                    <div class="title">&nbsp;</div>
                    <table>
                        <tr v-for="(i, index) in textTitleAttr" :key="i.id">
                            <td
                                    class="config-td config-right"
                                    v-for="txt in i"
                                    :key="txt.id"
                                    :class="{orange:index===1, oneHeight: index===0}"
                            >
                                <p class="rightC">{{txt==='0' ? '' : txt}}</p>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <div class="modelList">
            <div class="model-left">
                <div class="Box" v-for="(item, index) in parameter" :key="item.id">
                    <div class="title">
                        <span>{{item.catalog}}</span>
                    </div>
                    <!-- left table -->
                    <table>
                        <tr v-for="(i, ind) in item.params" :key="i.id">
                            <td
                                    valign="middle"
                                    class="config-td config-left"
                                    :class="{
                facingsHeight: ind === 1 && item.catalog === '发动机' ,
                facingsHeights: ind === 8 && item.catalog === '发动机'
                }"
                                    :style="{
                                      height: hei_box(ind, item.catalog.replace(/\s+/g, ''))
                                    }"
                v-html="item.catalog === '空调' ? decodeURI(i.name) : i.name"
                            >
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="model" v-if="flag" id="configure" @scroll="scroll">
                <!-- <div v-for="items in options.configuration" :key="items.id"> -->
                <!--<div class="Box" v-for="item in parameter" :key="item.id">
                          <div class="title">{{item.catalog}}</div>
                          <table>
                            <tr v-for="i in item.params" :key="i.id">
                              <td valign="middle" class="config-td config-left">{{i.name}}</td>
                              <td class="config-td config-right">
                                <p class="rightC" v-if="i.txt!=='有'&&i.txt!=='无'">{{i.txt}}</p>
                                <i class="ico" v-if="i.txt==='有'"></i>
                                <p class="rightC" v-if="i.txt==='无'">—</p>
                              </td>
                            </tr>
                          </table>
                </div>-->
                <div class="Box" v-for="(item, index) in textAttr" :key="item.id">
                    <div class="title">
                        <!--{{item.catalog}}-->
                        &nbsp;
                    </div>
                    <!-- right table -->
                    <table>
                        <tr v-for="(i, ind) in item" :key="i.id">
                            <!--<td valign="middle" class="config-td config-left">{{i.catalog}}</td>-->
                            <td class="config-td config-right" v-for="txt in i" :key="txt.id">
                                <p class="rightC"
                                :style="{
                                  height: hei_box(ind, item.catalog.replace(/\s+/g, ''))
                                }"
                                 v-if="txt==='有'">
                                    <i class="ico"></i>
                                </p>
                                <p class="rightC"
                                :style="{
                                  height: hei_box(ind, item.catalog.replace(/\s+/g, ''))
                                }"
                                 v-else-if="txt==='无'">
                                    <i class="line">—</i>
                                </p>
                                <p
                                        class="rightC"
                                        :class="{
                facingsHeight: ind === 1 && item.catalog === '发动机' ,
                facingsHeights: ind === 8 && item.catalog === '发动机'
                    }"
                                        :style="{
                                          height: hei_box(ind, item.catalog.replace(/\s+/g, ''))
                                        }"
                                        v-else
                                >{{txt}}</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <!-- <div class="content" v-for="i in item.params" :key="i.id">
                          <div class="line">
                            <div class="bc">
                              <div class="leftC">{{i.name}}</div>
                            </div>
                            <p class="rightC" v-if="i.txt!=='有'&&i.txt!=='无'">{{i.txt}}</p>
                            <i class="ico" v-if="i.txt==='有'"></i>
                            <p class="rightC" v-if="i.txt==='无'">—</p>
                          </div>
                </div>-->
                <!-- </div> -->
            </div>
        </div>
        <div v-if="this.productDesc" class="suoming_box">
            <div  class="suoming_fl">
                <img src='~/assets/images/commodity_details/icon-care1.png'/>
            </div>
            <div class="suoming_fr"  v-html="this.productDesc"></div>
        </div>
    </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: 'app',
    props: {
      options: {
        type: Object,
        default: () => {
          // 默认值
          return {
            name: ''
          }
        }
      }
    },
    watch: {
      options (val, old) {
        let ts = this
        let b = $('#scroll-id').offset().top
        window.addEventListener('scroll', function () {
          let a = document.body.scrollTop === 0 ? document.documentElement.scrollTop : document.body.scrollTop
          if (a < b) {
            b = $('#scroll-id').offset().top - 60 / (640 / $('body').width())
          }
          if (a >= b) {
            ts.scrollId = true
          } else {
            ts.scrollId = false
          }
        })
        window.addEventListener('orientationchange', function () {
          ts.scrollId = false
          b = 500
        }, false)
        if (val) {
          this.initialization()
        }
      }
    },
    data () {
      return {
        flag: false,
        popMenuShow: false,
        vehicle: [],
        parameter: [],
        textAttr: [],
        productId: 0,
        textTitleAttr: [[], []],
        scrollLeft: 0,
        scrollId: false,
        productDesc: '',
      }
    },
    methods: {
      hei_box (index, name) {
        // 判断车型 处理数据
        if (this.productId === 12601) {
          // 处理对应table 较多字段tr高度
          if (name === '外观' && [10].includes(index)) return '5rem'
          if (name === '内饰' && [1].includes(index)) return '5rem'
          if (name === '座椅' && [4, 5, 6, 7, 8, 9, 10].includes(index)) return '5rem'
          if (name === '安全' && [0, 11, 12, 13, 14, 15, 22].includes(index)) return '5rem'
        }
      },
      initialization () {
        if (this.options.configuration.length !== 0) {
          this.flag = true
          this.vehicle = []
          this.productDesc=this.options.productDesc
          for (let i = 0; i < this.options.configuration.length; i++) {
            this.vehicle.push(this.options.configuration[i].name)
          }
          /* for (let i of this.options.configuration.length) {
            for (let a of this.options.configuration[i].spec.length) {
              this.textAttr[a] = []
              for (let b of this.options.configuration[i].spec[a].params.length) {
                this.textAttr[a][b] = []
                this.textAttr[a][b][i] = this.options.configuration[i].spec[a].params[b].txt
              }
            }
          } */
          let ts = this

          ts.options.configuration.forEach((item, index) => {
            ts.textTitleAttr[0][index] = ts.options.configuration[index].name
            ts.textTitleAttr[1][index] = ts.options.configuration[index].price
            ts.options.configuration[index].spec.forEach((items, specs) => {
              this.textAttr[specs] = []
              this.textAttr[specs].catalog = ts.options.configuration[index].spec[specs].catalog
              ts.options.configuration[index].spec[specs].params.forEach((itmss, params) => {
                this.textAttr[specs][params] = []
                // console.log(`${index}-${specs}-${params}`)
                // shijian[specs][params][index] = `${specs}-${params}-${index}`
                for (var c = 0; c < ts.options.configuration.length; c++) {
                  this.textAttr[specs][params][c] = this.options.configuration[c].spec[specs].params[params].txt
                }
              })
            })
          })
          this.productId = this.options.productId
          this.parameter = this.options.configuration[0].spec
          console.log(this.parameter)
        }
      },
      clickVehicle () {
        this.popMenuShow = !this.popMenuShow
      },
      choice (item, index) {
        this.idnex = index
        const str = this.vehicle.splice(index, 1)
        this.vehicle.unshift(str[0])
        const parameterData = this.options.configuration.splice(index, 1)
        this.options.configuration.unshift(parameterData[0])
        this.parameter = this.options.configuration[0].spec
      },
      getBLen (str) {
        if (str == null) return 0
        if (typeof str !== 'string') {
          str += ''
        }
        return str.length
      },
      scroll (event) {
        this.scrollLeft = event.target.scrollLeft
        document.getElementById('configure').scrollLeft = this.scrollLeft
        document.getElementById('configure1').scrollLeft = this.scrollLeft
      }
    }
  }
</script>
<style lang="scss" scoped>
    @import "./sass/commodity-parameter";
</style>
