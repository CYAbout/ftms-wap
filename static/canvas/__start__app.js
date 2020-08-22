function CANVAS_PLAY (carType, CANVAS_ID) {
  CANVAS_ID = CANVAS_ID || 'application-canvas'
  var canvas, devices
  window.app
  var createCanvas = function () {
    canvas = document.createElement('canvas')
    canvas.setAttribute('id', CANVAS_ID)
    canvas.setAttribute('tabindex', 0)
    canvas.style.visibility = 'hidden'

    // Disable I-bar cursor on click+drag
    canvas.onselectstart = function () { return false }
    document.getElementById(ADD_CANVAS).appendChild(canvas)
    return canvas
  }

  var createInputDevices = function (canvas) {
    var devices = {
      elementInput: new pc.ElementInput(canvas, {
        useMouse: INPUT_SETTINGS.useMouse,
        useTouch: INPUT_SETTINGS.useTouch
      }),
      keyboard: INPUT_SETTINGS.useKeyboard ? new pc.Keyboard(window) : null,
      mouse: INPUT_SETTINGS.useMouse ? new pc.Mouse(canvas) : null,
      gamepads: INPUT_SETTINGS.useGamepads ? new pc.GamePads() : null,
      touch: INPUT_SETTINGS.useTouch && pc.platform.touch ? new pc.TouchDevice(canvas) : null
    }
    return devices
  }

  var configureCss = function (fillMode, width, height) {
    // Configure resolution and resize event
    if (canvas.classList) {
      canvas.classList.add('fill-mode-' + fillMode)
    }
    // css media query for aspect ratio changes
    var css = '@media screen and (min-aspect-ratio: ' + width + '/' + height + ') {'
    css += '    #application-canvas.fill-mode-KEEP_ASPECT {'
    css += '        width: auto;'
    css += '        height: 100%;'
    css += '        margin: 0 auto;'
    css += '    }'
    css += '}'

    // append css to style
    if (document.head.querySelector) {
      document.head.querySelector('style').innerHTML += css
    }
  }
  window.reflow = function () {
    // app.setCanvasFillMode(pc.FILLMODE_NONE);
    // setTimeout(function () {
    //     canvas.width = window.innerWidth * 2;
    //     canvas.height = (window.innerHeight - CANVAS_PROPORTION) * 2;
    //     setTimeout(function () {
    //         canvas.width = window.innerWidth * 2;
    //         canvas.height = (window.innerHeight - CANVAS_PROPORTION) * 2;
    //     }, 170)
    // }, 50)

    // app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW, window.innerWidth * 0.9, window.innerWidth * (CANVAS_PROPORTION) * 1);
    // app.resizeCanvas(window.innerWidth * 0.9, window.innerWidth * (CANVAS_PROPORTION) * 1);
    // setTimeout(function () {
    //     canvas.width = window.innerWidth * 2;
    //     canvas.height = (window.innerHeight - CANVAS_PROPORTION) * 2;
    //     setTimeout(function () {
    //         canvas.width = window.innerWidth * 2;
    //         canvas.height = (window.innerHeight - CANVAS_PROPORTION) * 2;
    //     }, 170)
    // }, 50)
    canvas.width = window.innerWidth * 2
    canvas.height = (window.innerHeight - CANVAS_PROPORTION) * 2
    if (window.RESET_CAR_CAMERA != null) {
      window.RESET_CAR_CAMERA()
    }
    setTimeout(function () {
      canvas.width = window.innerWidth * 2
      canvas.height = (window.innerHeight - CANVAS_PROPORTION) * 2
      if (window.RESET_CAR_CAMERA != null) {
        window.RESET_CAR_CAMERA()
      }
      setTimeout(function () {
        canvas.width = window.innerWidth * 2
        canvas.height = (window.innerHeight - CANVAS_PROPORTION) * 2
      }, 170)
    }, 50)

    canvas.style.width = ''
    canvas.style.height = ''
    var fillMode = pc.FILLMODE_KEEP_ASPECT//app._fillMode;
    if (fillMode == pc.FILLMODE_NONE || fillMode == pc.FILLMODE_KEEP_ASPECT) {
      if ((fillMode == pc.FILLMODE_NONE && canvas.clientHeight < window.innerHeight) || (canvas.clientWidth / canvas.clientHeight >= window.innerWidth / window.innerHeight)) {
        //canvas.style.marginTop = Math.floor((window.innerHeight - canvas.clientHeight) / 2) + 'px';
      } else {
        canvas.style.marginTop = ''
      }
    }
  }

  var displayError = function (html) {
    var div = document.createElement('div')

    div.innerHTML = [
      '<table style="background-color: #8CE; width: 100%; height: 100%;">',
      '  <tr>',
      '      <td align="center">',
      '          <div style="display: table-cell; vertical-align: middle;">',
      '              <div style="">' + html + '</div>',
      '          </div>',
      '      </td>',
      '  </tr>',
      '</table>'
    ].join('\n')
    document.body.appendChild(div)
  }
  canvas = createCanvas()
  devices = createInputDevices(canvas)
  var canvas_err = function () {
    window.webGL = false
    NOT_SUPPORT_CANVAS()
  }
  try {
    app = new pc.Application(canvas, {
      elementInput: devices.elementInput,
      keyboard: devices.keyboard,
      mouse: devices.mouse,
      gamepads: devices.gamepads,
      touch: devices.touch,
      graphicsDeviceOptions: window.CONTEXT_OPTIONS,
      assetPrefix: window.ASSET_PREFIX || '',
      scriptPrefix: window.SCRIPT_PREFIX || '',
      scriptsOrder: window.SCRIPTS || []
    })
  } catch (e) {
    if (e instanceof pc.UnsupportedBrowserError) {
      /*displayError('This page requires a browser that supports WebGL.<br/>' +
              '<a href="http://get.webgl.org">Click here to find out more.</a>');*/
      canvas_err()
    } else if (e instanceof pc.ContextCreationError) {
      /*displayError("It doesn't appear your computer can support WebGL.<br/>" +
              '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>');*/
      canvas_err()
    } else {
      //displayError('Could not initialize application. Error: ' + e);
      canvas_err()
    }

    return
  }

  app.configure(CONFIG_FILENAME, function (err) {
    if (err) {
      console.error(err)
    }

    //configureCss(app._fillMode, app._width, app._height);
    reflow()

    window.addEventListener('resize', function () {
      if (window.innerWidth >= window.innerHeight && window.innerWidth > 450) {
        reflow()
      }
    }, false)
    window.addEventListener('orientationchange', reflow, false)

    var preloadError = false
    var preloadErrorCallBack = function () {
      preloadError = true
    }
    var assets = app.assets
    for (i = 0; i < app.assets.length; i++) {
      app.assets[i].once('error', preloadErrorCallBack)
    }
    app.preload(function (err) {
      if (err) {
        console.error(err)
      }

      if (preloadError) {
        //预加载失败
        return
      }

      app.loadScene(SCENE_PATH, function (err, scene) {
        if (app.graphicsDevice && app.graphicsDevice.canvas) {
          if (err)
            console.error(err)
          else {
            app.start()
            document.getElementById(CANVAS_ID).style.visibility = 'visible'
          }

        }
      })
    })
  })

  pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
      var box = document.getElementById(ADD_CANVAS)
      var div = document.createElement('div')
      div.id = 'application-splash-wrapper'
      div.innerHTML = [
        '<div id=\'application-splash-back\'></div><div id=\'application-splash\'><canvas id=\'application-canvas-loading\' width=\'56\' height=\'56\'></canvas><div id=\'application-splash-number\'></div></div>'
      ].join('\n')
      // splash wrapper
      box.appendChild(div)
    }
    var canvasLoading = true
    var canvasLoadingNumber = 0
    var canvasLoadingTime = setTimeout(function () {
      canvasLoading = false
      window.webGL = false
      var bar = document.getElementById('application-splash-number')
      var logo = document.getElementById('application-canvas-loading')
      logocxt = logo.getContext('2d')
      var time = setInterval(function () {
        canvasLoadingNumber += 0.02
        if (canvasLoadingNumber >= 1) {
          clearInterval(time)
          NOT_SUPPORT_CANVAS()
          return
        }
        //console.log("假loading"+canvasLoadingNumber);
        bar.innerHTML = parseInt(canvasLoadingNumber * 100) + '%'
        logocxt.clearRect(0, 0, 56, 56)
        logocxt.beginPath()
        logocxt.lineWidth = 3
        logocxt.strokeStyle = '#d9d9d9'
        logocxt.arc(28, 28, 25, 0, 2 * Math.PI)
        logocxt.stroke()
        logocxt.beginPath()
        logocxt.strokeStyle = '#ca9f5a'
        logocxt.arc(28, 28, 25, 0, canvasLoadingNumber * 2 * Math.PI)
        logocxt.stroke()
        canvasLoadingNumber = canvasLoadingNumber
      }, 500)
    }, 100000)
    var hideSplash = function () {
      if (!canvasLoading) return
      var splash = document.getElementById('application-splash-wrapper')
      clearInterval(canvasLoadingTime)
      // UI_CONTRO_CANVAS("addUi", carType);
      START_CANVAS()
      setTimeout(function () {
        splash.parentElement.removeChild(splash)
      }, 0)
      document.getElementById(CANVAS_ID).style.visibility = 'visible'
    }

    var loadingNumber = function (e) {
      var logo = document.getElementById('application-canvas-loading')
      logocxt = logo.getContext('2d')
    }
    var setProgress = function (value) {
      if (!canvasLoading) return
      var bar = document.getElementById('application-splash-number')
      var logo = document.getElementById('application-canvas-loading')
      logocxt = logo.getContext('2d')
      if (bar) {
        value = Math.min(1, Math.max(0, value))
        //bar.style.width = value * 100 + '%';
        if (canvasLoading) {
          bar.innerHTML = parseInt(value * 100) + '%'
          logocxt.clearRect(0, 0, 56, 56)
          logocxt.beginPath()
          logocxt.lineWidth = 3
          logocxt.strokeStyle = '#d9d9d9'
          logocxt.arc(28, 28, 25, 0, 2 * Math.PI)
          logocxt.stroke()
          logocxt.beginPath()
          logocxt.strokeStyle = '#ca9f5a'
          logocxt.arc(28, 28, 25, 0, value * 2 * Math.PI)
          logocxt.stroke()
          canvasLoadingNumber = value
        }
      }
    }

    showSplash()
    loadingNumber()
    if (!app) return//新加
    app.on('preload:end', function () {
      app.off('preload:progress')
    })
    app.on('preload:progress', setProgress)
    app.on('start', hideSplash)
  })
  return app
}
//销毁APP
window.DESTROY_APP = function (app) {
  if (app && app.graphicsDevice && app.graphicsDevice.canvas)
    app.graphicsDevice.canvas.parentElement.removeChild(app.graphicsDevice.canvas)
  if (app)
    app.destroy()
}
window.UI_CONTRO_CANVAS = function (e, carType, ve) {
  var DISTANCEDEF_BASE = carType === 'avalon' ? 15 : carType === 'carolla' ? 18 : 18
  if (e == 'addUi') {

    var box = document.getElementById(ADD_CANVAS)
    var innerHTML = carType === 'avalon' ? [
      `<div class="ui_contro canvasUiContro">
                    <div class="vehicle">
                        <div class="car1 in"><b>2.5L</b>双擎版</div>
                        <div class="car4"><b>2.5L</b>汽油版</div>
                    </div>
                    <div class="colorList">
                        <div class="color5 in"></div>
                        <div class="color6"></div>
                        <div class="color1 "></div>
                        <div class="color2"></div>
                        <div class="color3"></div>
                        <div class="color4"></div>
                    </div>
                    <div class="intierior">
                        <div class="intierior1 in"></div>
                        <div class="intierior2"></div>
                        <div class="intierior3"></div>
                    </div>
                    <div class="colorTitle">
                    <p class="in">流光银</p >
                    <p>碳晶棕</p>
                    <p>珍珠白</p>
                    <p>墨渊黑</p>
                    <p>丹霞红</p>
                    <p>栗金棕</p>
                    </div>
                </div>
                <div class="fullScreen"></div>
                <div class="fullback"></div>`
    ].join('\n') : carType === 'carolla' ? [
      `<div class="ui_contro canvasUiContro_cal">
                    <div class="vehicle">
                        <div class="car1 in">先锋版</div>
                        <div class="car2">领先版</div>
                        <div class="car3">豪华版</div>
                        <div class="car4">旗舰版</div>
                    </div>
                    <div class="colorList">
                        <div class="color5 in"></div>
                        <div class="color1"></div>
                        <div class="color2"></div>
                        <div class="color3"></div>
                        <div class="color4"></div>
                        <div class="color6"></div>
                        <div class="color7"></div>
                    </div>
                    <div class="intierior">
                        <div class="intierior1 in"></div>
                        <div class="intierior2"></div>
                    </div>
                    <div class="colorTitle">
                        <p class="in">天际蓝金属色</p>
                        <p>超级白色</p>
                        <p>黑云母色</p>
                        <p>流沙米金属色</p>
                        <p>珍珠白色</p>
                        <p>铂青铜金属色</p>
                        <p>银金属色</p>
                    </div>
                </div>
                <div class="fullScreen"></div>
                <div class="fullback"></div>`
    ].join('\n') : [
      `<div class="ui_contro canvasUiContro_yz">
        <div class="vehicle">
            <div class="car1 in">奕泽</div>
        </div>
        <div class="colorList">
            <div class="color7 in"></div>
            <div class="color1"></div>
            <div class="color2"></div>
            <div class="color3"></div>
            <div class="color4"></div>
            <div class="color5"></div>
            <div class="color6"></div>
            <div class="color8"></div>
            <div class="color9"></div>
        </div>
        <div class="intierior">
            <div class="intierior2"></div>
        </div>
        <div class="colorTitle">
        <p class="in">绛珠红x黑顶</p>
        <p>骑士蓝x白顶</p>
        <p>墨渊黑</p>
        <p>墨渊黑x白顶</p>
        <p>珍珠白</p>
        <p>珍珠白x黑顶</p>
        <p>绛珠红x白顶</p>
        <p>栗金棕</p>
        <p>流光银</p>
        </div>
    </div>
    <div class="fullScreen"></div>
    <div class="fullback"></div>
    `
    ].join('\n')
    var div = document.createElement('div')
    div.id = 'canvasUiContro'
    div.innerHTML = innerHTML
    // splash wrapper
    box.appendChild(div)
    $('.ui_contro .vehicle>div').click(function () {
      $(this).addClass('in').siblings().removeClass('in')
      window.CAR_ID = $(this).index()
      if (CAR_TYPE_NAME) {
        window.CAR_TYPE_NAME(window.CAR_ID)
      }
    })
    $('.ui_contro .colorList>div').click(function () {
      $(this).addClass('in').siblings().removeClass('in')
      $('.ui_contro .colorTitle>p').eq($(this).index()).addClass('in').siblings().removeClass('in')
      window.CAR_COLOR_ID = $(this).index()
    })
    $('.ui_contro .intierior>div').click(function () {
      $(this).addClass('in').siblings().removeClass('in')
      window.CAR_INNER_ID = $(this).index()
    })

    $('.fullScreen,.tui-hengping').click(function () {
      $('.content .right').removeClass('back')
      $('.content .right').addClass('full')
      $('.ui_contro').addClass('da')
      $('.hengping').addClass('in')
      $('.version-select .left').addClass('in')
      $('.foot').addClass('in')
      $('.tui-hengping').removeClass('in')
      $('.fullScreen,.title').hide()
      if (window.currentStep != 3) {
        window.DISTANCEDEF = DISTANCEDEF_BASE
      }
    })
    $('.tui-hengping').click(function () {
      // 进入横屏
      $('.pre-step').removeClass('in')
      $('.op-btn').hide()
      CANVAS_PROPORTION = -100
      // CANVAS_PROPORTION = 0; // window.innerHeight / window.innerWidth;//canvas尺寸比例
      reflow()
    })
    $('.fullScreen').click(function () {
      $('.pre-step').removeClass('in')
      CANVAS_PROPORTION = -100 // 800 / 1400;//canvas尺寸比例
      reflow()
    })

    $('.fullback').click(function () {
      $('.content .right').removeClass('full')
      $('.content .right').addClass('back')
      CANVAS_PROPORTION = 260 // window.innerWidth / 2.4 / window.innerHeight;//canvas尺寸比例
      reflow()
      $('.fullScreen,.title').show()
      $('.ui_contro').removeClass('da')
      $('.hengping').removeClass('in')
      $('.content .left').removeClass('in')
      $('.foot').removeClass('in')
      $('.tui-hengping').addClass('in')
      $('.op-btn').show()
      if (window.currentStep != 3) {
        window.DISTANCEDEF = DISTANCEDEF_BASE
        $('.bm-box .op-btn1').hide()
        $('.bm-box .op-btn').show()
        if (window.currentStep === 2) {
          $('.pre-step').addClass('in')
        }
      } else {
        $('.bm-box .op-btn1').show()
        $('.bm-box .op-btn').hide()
      }
    })
    $('.hengping').click(function () {
      // 退出横屏
      var height = window.innerHeight
      var width = window.innerWidth
      var ratio = 1.3
      var DISTANCEDEF = DISTANCEDEF_BASE
      if (height > width) {
        ratio = 2
        DISTANCEDEF = DISTANCEDEF_BASE
      }
      $('.content .right').removeClass('full')
      $('.content .right').addClass('back')
      $('.tui-hengping').addClass('in')
      CANVAS_PROPORTION = 260 // height / ratio / width;//canvas尺寸比例
      reflow()
      // $(".fullback").hide();
      $('.fullScreen,.title').show()
      $('.ui_contro').removeClass('da')
      $(this).removeClass('in')
      $('.content .left').removeClass('in')
      $('.foot').removeClass('in')
      $('.op-btn').show()
      // $('.mathings').css('z-index', 2000000000)
      // $(".tui-hengping").addClass("in");
      if (window.currentStep != 3) {
        window.DISTANCEDEF = DISTANCEDEF
        $('.bm-box .op-btn1').hide()
        $('.bm-box .op-btn').show()
        if (window.currentStep === 2) {
          $('.pre-step').addClass('in')
        }
      } else {
        $('.bm-box .op-btn1').show()
        $('.bm-box .op-btn').hide()
      }
    })

    //选择外观
    $('.foot .btn1').click(function () {
      window.currentStep++
      $(this).removeClass('in')
      $('.foot .prve,.foot .btn2').addClass('in')
      $('.left .color').addClass('in').siblings().removeClass('in')
      $('.step-title').html('外观颜色')
      $('.op-btn span').text('内饰颜色')
      // $('.pre-step').addClass('in')
      UI_CONTRO_CANVAS(1)//显示颜色选择UI
    })
    //选择内饰
    $('.foot .btn2').click(function () {
      window.currentStep++
      $(this).removeClass('in')
      $('.foot .btn3').addClass('in')
      $('.left .decoration').addClass('in').siblings().removeClass('in')
      UI_CONTRO_CANVAS(2)//显示内饰颜色选择UI想
      $('.step-title').html('内饰颜色')
      $('.op-btn span').text('即刻订购')
      // $('.pre-step').addClass('in')
      $('.ui_contro .colorTitle').hide()
    })
    $('.foot .prve').click(function () {
      if (window.currentStep == 2) {
        //显示车型配置
        $(this).removeClass('in')
        $('.foot .btn1').addClass('in')
        $('.foot .btn2').removeClass('in')
        $('.left .matching').addClass('in').siblings().removeClass('in')
        $('.step-title').html('车型配置')
        $('.op-btn span').text('外观颜色')
        // $('.pre-step').removeClass('in')
        UI_CONTRO_CANVAS(0)
        $('.ui_contro .colorTitle').hide()
      } else if (window.currentStep == 3) {
        //显示外观颜色
        $('.foot .btn2').addClass('in')
        $('.left .color').addClass('in').siblings().removeClass('in')
        $('.step-title').html('外观颜色')
        $('.op-btn span').text('内饰颜色')
        // $('.pre-step').addClass('in')
        // $('.bm-box .op-btn1').hide();
        // $('.op-btn').show();
        UI_CONTRO_CANVAS(1)
        setTimeout(function () {
          window.DISTANCEDEF = window.DISTANCEDEF + 1
        }, 200)
      }
      window.currentStep--
      $('.content .left>div').eq(window.currentStep).addClass('in').removeClass('yellow')
      $('.content .left>div').eq(window.currentStep + 1).removeClass('in')

    })

  }
  if (typeof e == 'number') {
    window.UIMODE = e
    if (e === 1) {
      if (carType !== 'avalon') {
        $('.colorTitle').fadeIn()
      } else {
        // $('.colorTitle').hide();
      }
    } else {
      $('.colorTitle').fadeOut()
    }
    $('.ui_contro>div').eq(e).addClass('in').siblings().removeClass('in')
  }

}
window.CANVAS_PLAY = CANVAS_PLAY
window.initCanvas = function (carType, type) {
  window.IPHONEXS = MobileDevice.getModels().join(' or ')//判断iphone机型
  window.currentStep = 1
  window.ASSET_PREFIX = carType === 'avalon' ? `/canvas/` : carType === 'carolla' ? `/canvas-cal/` : '/canvas-yz/'
  // window.CANVAS_PROPORTION = 1300 / 1730;//canvas尺寸比例
  window.CANVAS_PROPORTION = carType === 'yize' ? 260 : 260 // window.innerHeight / 2 / window.innerWidth;
  window.SCRIPT_PREFIX = ''
  window.SCENE_PATH = carType === 'avalon' ? '667837.json' : carType === 'carolla' ? '670288.json' : '679837.json'
  window.CONTEXT_OPTIONS = {
    'antialias': true,
    'alpha': false,
    'preserveDrawingBuffer': false,
    'preferWebGl2': true
  }
  window.SCRIPTS = [15669277, 15617492, 15617476, 15617486, 15617493, 15633825, 15634151, 15634157, 15636246, 15648806, 15663864, 15666803, 15669114, 15669233, 15669240, 15669681, 15670751, 15670752, 15671978, 15672962, 15687381]
  window.CONFIG_FILENAME = window.ASSET_PREFIX + 'config.json'
  window.ADD_CANVAS = 'matchings'//需要将canvas添加到哪个ID中
  window.INPUT_SETTINGS = {
    useKeyboard: true,
    useMouse: true,
    useGamepads: false,
    useTouch: true
  }
  //加载完成后执行
  window.START_CANVAS = function () {
    // const renderIndex = carType === 'yize' ? 1 : 0;
    // alert(renderIndex)
    // window.UI_CONTRO_CANVAS(renderIndex, carType, ve);
    if (type === 'detail') {
      //$('.fullScreen').hide();
    }
  }
  // //如果不支持webgl和加载超时后执行
  // window.NOT_SUPPORT_CANVAS = function () {
  // }
  // window.CAR_TYPE_NAME = function (e) {
  //     //选择车型时执行：0：混动版   1：汽油版
  //     return 0;
  // };
  pc.script.legacy = false// eslint-disable-line no-undef
  // window.CANVAS_PLAY();

  // if (productId == '12595') {
  //   window.CANVAS_PLAY();
  // } else {
  //   window.reflow();
  // }
}


