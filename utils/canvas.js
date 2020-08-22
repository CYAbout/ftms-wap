/**
 * Created by oyhanyu on 2018/12/4.
 */
let DPR = 1// 获取设备的物理像素比
let viewW = 1
let viewH = 1
const cansW = viewW * DPR// 放大canvas
const cansH = viewH * DPR
let ctx = null
const imgArr = []// 图片数组
let curDeg = 1// 代表当前显示的图片下标
const imgTotal = 36// 图片总数
const imgRatio = (447 / 1000)// 图片高宽比
const imgW = viewW * 1.5// 图宽
const imgH = imgW * imgRatio// 图高
// 绘图
// 参数：图片对象下标，移动方向
function drawImg(n, curDeg, ctx, imgArr, type) {
  if (type === 'left') {
    if (curDeg > 0) {
      curDeg--
    } else {
      curDeg = 50
    }
  } else if (type === 'right') {
    if (curDeg < 50) {
      curDeg++
    } else {
      curDeg = 0
    }
  }
  ctx.clearRect(0, 0, cansW, cansH)
  // 参数：图片对象，X偏移量，Y偏移量，图宽，图高
  ctx.drawImage(imgArr[n], -(imgW - viewW) * 0.5, (viewH - imgH) * 0.5, imgW, imgH)
}

// function draw(ctx, img, imgW, imgH, viewW, viewH) {
//   ctx.clearRect(0, 0, cansW, cansH)
//   // 参数：图片对象，X偏移量，Y偏移量，图宽，图高
//   ctx.drawImage(imgArr[n], -(imgW - viewW) * 0.5, (viewH - imgH) * 0.5, imgW, imgH)
// }

const init = (window, canvas) => {
  let baseURL = 'img/'
  let imgURL = ''
  let imgObj = null
  let imgIndex = 1
  // const canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  DPR = window.devicePixelRatio// 获取设备的物理像素比
  viewW = window.innerWidth
  viewH = window.innerHeight
  // 重设canvas宽高
  // 显示的宽高
  canvas.style.width = cansW + 'px'
  canvas.style.height = cansH + 'px'
  // 画布宽高
  canvas.width = cansW
  canvas.height = cansH
  // loading
  for (var i = 1; i <= imgTotal; i++) {
    imgURL = baseURL + i + '.png'
    imgObj = new Image()
    imgObj.src = imgURL
    // 将所有图片对象压入一个数组,方便调用
    imgArr.push(imgObj)
    imgObj.onload = function () {
      imgIndex++
      if (imgIndex > 51) {
        // eslint-disable-next-line no-undef
        $('.loading').hide()
        // 默认图
        drawImg(0, curDeg, ctx)
      }
    }
  }
  // 手指触摸起点
  let startPoint = 0
  // 滑动多长距离，这里取（canvas宽/图片总数的一半）
  // 数值越大约灵敏
  const distance = cansW / 30
  // 开始
  // eslint-disable-next-line no-undef
  $('#canvas').on({
    'touchstart': function (e) {
      // 记录起始触摸点
      startPoint = e.touches[0].clientX
      // 去掉默认事件，iPhone下可去除双击页面默认跳动(翻页)效果
      e.preventDefault()
    },
    'touchmove': function (e) {
      var tempPoint = e.touches[0].clientX
      // 向右移动
      if ((tempPoint - startPoint) > distance) {
        drawImg(curDeg, curDeg, ctx, 'right')
        // 符合距离条件移动后，将记录点设到手指最新位置
        startPoint = tempPoint
      } else if ((tempPoint - startPoint) < -distance) { // 左
        drawImg(curDeg, curDeg, ctx, 'left')
        startPoint = tempPoint
      }
      // 禁止移动页面
      e.preventDefault()
    }
  })
}

export default init
