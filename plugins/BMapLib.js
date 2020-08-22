/**
 * 百度地图API封装
 */
'use strict'
import Vue from 'vue'

const BMap = window.BMap || {}
// eslint-disable-next-line no-unused-vars
const BMAP_STATUS_SUCCESS = window.BMAP_STATUS_SUCCESS

const EARTHRADIUS = 6370996.81

/**
 * 将度转化为弧度
 * @param {degree} Number 度
 * @returns {Number} 弧度
 */
function degreeToRad (degree) {
  return Math.PI * degree / 180
}

/**
 * 将v值限定在a,b之间，纬度使用
 */
function _getRange (v, a, b) {
  if (a != null) {
    v = Math.max(v, a)
  }
  if (b != null) {
    v = Math.min(v, b)
  }
  return v
}

/**
 * 将v值限定在a,b之间，经度使用
 */
function _getLoop (v, a, b) {
  while (v > b) {
    v -= b - a
  }
  while (v < a) {
    v += b - a
  }
  return v
}

const BMapLib = {

  /**
   * 计算两点之间的距离,两点坐标必须为经纬度
   * @param {point1} Point 点对象
   * @param {point2} Point 点对象
   * @returns {Number} 两点之间距离，单位为米
   */
  getDistance: (lng1, lat1, lng2, lat2) => {
    let point1 = new BMap.Point(parseFloat(lng1), parseFloat(lat1))
    let point2 = new BMap.Point(parseFloat(lng2), parseFloat(lat2))
    // 判断类型
    if (!(point1 instanceof BMap.Point) || !(point2 instanceof BMap.Point)) {
      return 0
    }
    point1.lng = _getLoop(point1.lng, -180, 180)
    point1.lat = _getRange(point1.lat, -74, 74)
    point2.lng = _getLoop(point2.lng, -180, 180)
    point2.lat = _getRange(point2.lat, -74, 74)
    let x1, x2, y1, y2
    x1 = degreeToRad(point1.lng)
    y1 = degreeToRad(point1.lat)
    x2 = degreeToRad(point2.lng)
    y2 = degreeToRad(point2.lat)
    return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)))
  },

  /**
   * 百度地图API功能 (IP定位)
   */
  getCurrentPositionByIp: () => {
    return new Promise(function (resolve, reject) {
      try {
        let myCity = new BMap.LocalCity()
        myCity.get(function (result) {
          resolve({
            address: result.name,
            id: '',
            point: result.center
          })
        })
      } catch (ex) {
        reject(ex)
      }
    })
  },

  /**
   * 百度地图API功能 (H5定位)
   */
  getCurrentPositionByH5: () => {
    return new Promise(function (resolve, reject) {
      try {
        let geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function (position) {
          if (this.getStatus() === 0) {
            // console.log('您的位置：' + position.point.lng + ',' + position.point.lat)
            var lat = position.point.lat
            var lon = position.point.lng
            var point = new BMap.Point(lon, lat)
            var myGeo = new BMap.Geocoder()
            var city = ''
            myGeo.getLocation(point, function (result) {
              // console.log('定位到的省：' + result.addressComponents.province)
              // console.log('定位到的市：' + result.addressComponents.city)
              if (result.addressComponents.city === '北京市') {
                city = '北京'
              } else {
                city = result.addressComponents.city
              }
              resolve({
                city: city,
                province: result.addressComponents.province
              })
            })
          } else {
            // 定位经纬度失败，默认北京
            console.log('定位经纬度失败')
            resolve({
              city: '北京',
              province: '北京市'
            })
          }
        }, function (error) {
          alert('定位失败原因：' + error.mf)
          // 获取失败，默认北京
          resolve({
            city: '北京',
            province: '北京市'
          })
        })
      } catch (ex) {
        reject(ex)
      }
    })
  },

  /**
   * 通过城市地区获取其经纬度
   * @param city 城市
   * @param district 地区
   * @returns {Promise}
   */
  getPointByCity: (city, district = '') => {
    return new Promise(function (resolve, reject) {
      try {
        // 创建地址解析器实例
        let myGeo = new BMap.Geocoder()
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(city + district, function (point) {
          if (point) {
            resolve(point)
          } else {
            // reject('您选择地址没有解析到结果!')
          }
        }, city)
      } catch (ex) {
        reject(ex)
      }
    })
  }
}

Vue.prototype.$BMapLib = BMapLib
// export default BMapLib
