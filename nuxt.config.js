const path = require('path')
const webpack = require('webpack')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const CleanWebpackPlugin = require('clean-webpack-plugin')

const apiConfig = require('./api.config') // 得到server配置
const isProdModel = Object.is(process.env.NODE_ENV, 'production')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '一汽丰田官方商城',
    meta: [
      { charset: 'utf-8' },
      // {name: 'viewport', content: 'width=750, user-scalable=no, target-densitydpi=device-dpi'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
      },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      { name: 'telephone=no', content: 'format-detection' },
      { name: 'email=no', content: 'format-detection' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
      { name: 'apple-touch-icon', content: '/static/icon.png' },
      { name: 'msapplication-TileImage', content: '/static/icon.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        /* 设计稿是750，html的font-size就是75，如果某个元素时150px的宽，换算成rem就是150 / 75 = 2rem */
        innerHTML: '!function(e,t){function n(){t.body?t.body.style.fontSize=12*o+"px":t.addEventListener("DOMContentLoaded",n)}function d(){var e=i.clientWidth/10;i.style.fontSize=e+"px"}var i=t.documentElement,o=e.devicePixelRatio||1;if(n(),d(),e.addEventListener("resize",d),e.addEventListener("pageshow",function(e){e.persisted&&d()}),o>=2){var a=t.createElement("body"),s=t.createElement("div");s.style.border=".5px solid transparent",a.appendChild(s),i.appendChild(a),1===s.offsetHeight&&i.classList.add("hairlines"),i.removeChild(a)}}(window,document);',
        type: 'text/javascript',
        charset: 'utf-8'
      }, {
        /* 百度访问量统计 */
        innerHTML: 'var _hmt = _hmt || []; (function() { var hm = document.createElement("script"); hm.src = "https://hm.baidu.com/hm.js?f696320748b83c5b23a8bd9bcfc79871"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s); })();',
        type: 'text/javascript',
        charset: 'utf-8'
      }, {
        innerHTML: 'var _hmt = _hmt || []; (function() { var hm = document.createElement("script"); hm.src = "https://hm.baidu.com/hm.js?abdf29a3ce795d9a60e3ff83dccef51f"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s); })();',
        type: 'text/javascript',
        charset: 'utf-8'
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  /*
  ** Customize the progress bar color
  */
  // loading: {color: '#3B8070'},
  loading: { color: '#0088f5' },
  cache: {
    max: 100,
    maxAge: 1000 * 60 * 15
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/iconfont/iconfont.css',
    'element-ui/lib/theme-chalk/index.css'
    // 'swiper/dist/css/swiper.css',
    // 'vant/lib/vant-css/index.css'
  ],
  /*
  ** Build configuration
  */
  build: {
    publicPath: apiConfig.cdnUrl + '/_nuxt/', // 设置 cdn 地址
    filenames: {
      vendor: 'vendor.[hash].js',
      app: 'static.[chunkhash].js'
    },
    vendor: [
      'axios',
      'swiper',
      'util',
      'element-ui'
    ],
    loaders: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }, {
        test: /\.scss$/,
        loader: 'vue-style-loader!css-loader!sass-loader'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader',
        include: /node_modules/,
        exclude: /assets/
      }
      //   test: /\.(eot|svg|ttf|woff|woff2)$/,
      //   loader: 'file-loader'
      // }
    ],
    postcss: [
      require('postcss-partial-import')(),
      require('postcss-nested')(),
      require('postcss-hexrgba')(),
      require('postcss-custom-properties')({
        warnings: false
      }),
      require('autoprefixer')({
        // browsers: ['last 3 versions'],
        browsers: ['Android >= 4.0', 'iOS >= 7']
      }),
      // px -> rem
      require('postcss-pxtorem')({
        rootValue: 75,
        propList: ['*']
      })
    ],
    maxChunkSize: 350000,
    extractCSS: { allChunks: true }, // css 单独打包
    babel: {
      presets: ['es2015', 'stage-2'],
      plugins: [
        'transform-async-to-generator',
        'transform-runtime'
      ],
      comments: true
    },

    /*
    ** Run ESLint on save
    */
    extend(webpackConfig, { isDev, isClient }) {
      webpackConfig.resolve.alias['swiper$'] = 'swiper/dist/js/swiper.js'
      webpackConfig.resolve.alias['dom7$'] = 'dom7/dist/dom7.js'
      const sassResourcesLoader = {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            'assets/sass/init.scss'
          ]
        }
      }

      // 遍历nuxt定义的loader配置，向里面添加新的配置。
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.test.toString() === '/\\.vue$/') {
          rule.options.loaders.sass.push(sassResourcesLoader) // sass
          rule.options.loaders.scss.push(sassResourcesLoader) // scss
        }
        if (['/\\.sass$/', '/\\.scss$/'].indexOf(rule.test.toString()) !== -1) {
          rule.use.push(sassResourcesLoader)
        }
      })

      if (isDev && isClient) {
        // Run ESLINT on save
        webpackConfig.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      if (isProdModel) {
        const vueLoader = webpackConfig.module.rules.find(loader => loader.loader === 'vue-loader')
        if (vueLoader) {
          // 处理 Template 中的 cdn 地址
          vueLoader.options.loaders.html = path.resolve(__dirname, './extend/html-cdn-loader')
          // 处理 CSS 中的 cdn 地址
          const vueLoaders = vueLoader.options.loaders
          for (cssLoader in vueLoaders) {
            if (Array.isArray(vueLoaders[cssLoader])) {
              vueLoaders[cssLoader].forEach(loader => {
                if (loader.loader === 'css-loader') {
                  loader.options.root = apiConfig.cdnUrl
                }
              })
            }
          }
        }

        // 清空文件夹
        webpackConfig.plugins.push(new CleanWebpackPlugin(['.nuxt/dist']))

        // 去除代码块内的告警语句 去除console.log
        webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        }))

        // 压缩图片
        webpackConfig.plugins.push(new ImageminPlugin({
          disable: true,
          pngquant: {
            quality: '95-100'
          }
        }))
      }
    },
    // (全局配置)
    plugins: []
  },
  dev: isProdModel,
  env: {
    server: apiConfig
  },
  plugins: [
    { src: '~/plugins/filters.js' },
    { src: '~/plugins/data-sync.js', ssr: false }, // 用户信息同步
    { src: '~/plugins/util.js', ssr: false },
    { src: '~/plugins/swiper.js', ssr: false },
    { src: '~/plugins/axios', ssr: true },
    { src: '~/plugins/element-ui.js', ssr: true },
    // {src: '~/plugins/vant.js', ssr: true}, 
    { src: '~/plugins/mint-ui.js', ssr: true },
    { src: '~/plugins/url-config.js' },
    { src: '~/plugins/cache.js', ssr: false },
    { src: '~/plugins/storage.js', ssr: false },
    { src: '~/plugins/request', ssr: false },
    // {src: '~/plugins/award-rotate', ssr: false}, // 大转盘抽奖
    { src: '~/plugins/common.js', ssr: false },
    { src: '~/plugins/video-player.js', ssr: false },
    { src: '~/plugins/auth.js', ssr: false },
    { src: '~/plugins/BMapLib.js', ssr: false } // 百度地图 （IP定位、浏览器定位、通过城市名称获取坐标、计算两坐标间距离）
  ],
  // router 属性配置
  router: {
    middleware: ['auth', 'redirect'],
    linkActiveClass: 'link-active'
    // scrollBehavior(to, from, savedPosition) {
    //   return {x: 0, y: 0}
    // }
  }
}
