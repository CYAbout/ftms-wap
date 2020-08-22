// 生产环境：production 开发环境：develop
const env = process.env.NODE_ENV || 'develop'

const serverUrlMap = {
  // 开发环境
  develop: {
    cdnUrl: '', // cdn地址
    mainUrl: 'https://mall.ftms.devbmsoft.cn/', // dev.app.event.ftms.devwox.com:8080 http://127.0.0.1:8082/
    picUrl: 'https://mall.ftms.devbmsoft.cn/' // 图片服务
  },
  // 生产环境
  production: {
    cdnUrl: '',
    mainUrl: 'https://mall.ftms.com.cn/',
    picUrl: 'https://mall.ftms.com.cn/img' // 图片服务
  }
};

module.exports = serverUrlMap[env]
