function CANVAS_PLAY(carType) {
    var CANVAS_ID = 'application-canvas';

    var canvas, devices, app;

    var createCanvas = function () {
        canvas = document.createElement('canvas');
        canvas.setAttribute('id', CANVAS_ID);
        canvas.setAttribute('tabindex', 0);
        // canvas.style.visibility = 'hidden';

        // Disable I-bar cursor on click+drag
        canvas.onselectstart = function () { return false; };

        document.getElementById(ADD_CANVAS).appendChild(canvas);
        window.canvas = canvas;
        return canvas;
    };

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
        };

        return devices;
    };

    var configureCss = function (fillMode, width, height) {
        // Configure resolution and resize event
        if (canvas.classList) {
            canvas.classList.add('fill-mode-' + fillMode);
        }

        // css media query for aspect ratio changes
        var css = "@media screen and (min-aspect-ratio: " + width + "/" + height + ") {";
        css += "    #application-canvas.fill-mode-KEEP_ASPECT {";
        css += "        width: auto;";
        css += "        height: 100%;";
        css += "        margin: 0 auto;";
        css += "    }";
        css += "}";

        // append css to style
        if (document.head.querySelector) {
            document.head.querySelector('style').innerHTML += css;
        }
    };

    var reflow = function () {

        canvas.width = '1430';
        canvas.height = '800';
        //app.resizeCanvas(canvas.width, canvas.height);
        //app.resizeCanvas(1430, 800);
        //alert(canvas.width)
        app.setCanvasFillMode(pc.FILLMODE_NONE, window.innerWidth * 1, window.innerWidth * (CANVAS_PROPORTION) * 1);
        canvas.style.width = '';
        canvas.style.height = '';

        var fillMode = pc.FILLMODE_KEEP_ASPECT;//app._fillMode;

        if (fillMode == pc.FILLMODE_NONE || fillMode == pc.FILLMODE_KEEP_ASPECT) {
            if ((fillMode == pc.FILLMODE_NONE && canvas.clientHeight < window.innerHeight) || (canvas.clientWidth / canvas.clientHeight >= window.innerWidth / window.innerHeight)) {
                //canvas.style.marginTop = Math.floor((window.innerHeight - canvas.clientHeight) / 2) + 'px';
            } else {
                canvas.style.marginTop = '';
            }
        }



    };

    var displayError = function (html) {
        var div = document.createElement('div');

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
        ].join('\n');
        document.body.appendChild(div);
    };
    canvas = createCanvas();
    devices = createInputDevices(canvas);
    var canvas_err = function () {
        window.webGL = false;
        NOT_SUPPORT_CANVAS();
    }

    try {
        window.app = new pc.Application(canvas, {
            elementInput: devices.elementInput,
            keyboard: devices.keyboard,
            mouse: devices.mouse,
            gamepads: devices.gamepads,
            touch: devices.touch,
            graphicsDeviceOptions: window.CONTEXT_OPTIONS,
            assetPrefix: window.ASSET_PREFIX || "",
            scriptPrefix: window.SCRIPT_PREFIX || "",
            scriptsOrder: window.SCRIPTS || []
        });
        console.log('app', app);
        app = window.app;
    } catch (e) {
        if (e instanceof pc.UnsupportedBrowserError) {
            /*displayError('This page requires a browser that supports WebGL.<br/>' +
                    '<a href="http://get.webgl.org">Click here to find out more.</a>');*/
            canvas_err();
        } else if (e instanceof pc.ContextCreationError) {
            /*displayError("It doesn't appear your computer can support WebGL.<br/>" +
                    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>');*/
            canvas_err();
        } else {
            //displayError('Could not initialize application. Error: ' + e);
            canvas_err();
        }

        return;
    }

    app.configure(CONFIG_FILENAME, function (err) {
        if (err) {
            console.error(err);
        }

        //configureCss(app._fillMode, app._width, app._height);
        reflow();

        window.addEventListener('resize', reflow, false);
        window.addEventListener('orientationchange', reflow, false);

        app.preload(function (err) {
            if (err) {
                console.error(err);
            }

            app.loadScene(SCENE_PATH, function (err, scene) {
                if (err) {
                    console.error(err);
                }
                app.start();
            });
        });
    });

    pc.script.createLoadingScreen(function (app) {
        var showSplash = function () {

            var box = document.getElementById(ADD_CANVAS);

            var div = document.createElement('div');
            div.id = "application-splash-wrapper"
            div.innerHTML = [
                "<div id='application-splash-back'></div><div id='application-splash'><canvas id='application-canvas-loading' width='56' height='56'></canvas><div id='application-splash-number'></div></div>"
            ].join('\n');
            // splash wrapper
            box.appendChild(div);
        };
        var canvasLoading = true;
        var canvasLoadingNumber = 0;
        var canvasLoadingTime = setTimeout(function () {
            canvasLoading = false;
            window.webGL = false;
            var bar = document.getElementById('application-splash-number');
            var logo = document.getElementById("application-canvas-loading");
            logocxt = logo.getContext("2d");
            var time = setInterval(function () {
                canvasLoadingNumber += 0.02;
                if (canvasLoadingNumber >= 1) {
                    clearInterval(time);
                    NOT_SUPPORT_CANVAS();
                    return;
                }
                //console.log("假loading"+canvasLoadingNumber);
                bar.innerHTML = parseInt(canvasLoadingNumber * 100) + "%";
                logocxt.clearRect(0, 0, 56, 56);
                logocxt.beginPath();
                logocxt.lineWidth = 3;
                logocxt.strokeStyle = "#d9d9d9";
                logocxt.arc(28, 28, 25, 0, 2 * Math.PI);
                logocxt.stroke();
                logocxt.beginPath();
                logocxt.strokeStyle = "#ca9f5a";
                logocxt.arc(28, 28, 25, 0, canvasLoadingNumber * 2 * Math.PI);
                logocxt.stroke();
                canvasLoadingNumber = canvasLoadingNumber;
            }, 500)
        }, 50000)
        var hideSplash = function () {
            if (!canvasLoading) return;
            var splash = document.getElementById('application-splash-wrapper');
            clearInterval(canvasLoadingTime);
            UI_CONTRO_CANVAS("addUi", carType);
            START_CANVAS()
            setTimeout(function () {
                splash.parentElement.removeChild(splash);
            }, 0)
        };

        var loadingNumber = function (e) {
            var logo = document.getElementById("application-canvas-loading");
            logocxt = logo.getContext("2d");
        }
        var setProgress = function (value) {
            if (!canvasLoading) return;
            var bar = document.getElementById('application-splash-number');
            var logo = document.getElementById("application-canvas-loading");
            logocxt = logo.getContext("2d");
            if (bar) {
                value = Math.min(1, Math.max(0, value));
                //bar.style.width = value * 100 + '%';
                if (canvasLoading) {
                    bar.innerHTML = parseInt(value * 100) + "%";
                    logocxt.clearRect(0, 0, 56, 56);
                    logocxt.beginPath();
                    logocxt.lineWidth = 3;
                    logocxt.strokeStyle = "#d9d9d9";
                    logocxt.arc(28, 28, 25, 0, 2 * Math.PI);
                    logocxt.stroke();
                    logocxt.beginPath();
                    logocxt.strokeStyle = "#ca9f5a";
                    logocxt.arc(28, 28, 25, 0, value * 2 * Math.PI);
                    logocxt.stroke();
                    canvasLoadingNumber = value;
                }
            }
        };

        showSplash();
        loadingNumber();
        app.on('preload:end', function () {
            app.off('preload:progress');
        });
        app.on('preload:progress', setProgress);
        app.on('start', hideSplash);
    });

    window.UI_CONTRO_CANVAS = function (e, carType) {

        if (e == "addUi") {

            var box = document.getElementById(ADD_CANVAS);
            var innerHTML = carType === 'avalon' ? [
                '<div class="ui_contro canvasUiContro"><div class="vehicle"><div class="car1 in"><span></span>亚洲龙HEV</div><div class="car2"><span></span>亚洲龙汽油版</div></div><div class="colorList"><div class="color1 in"></div><div class="color2"></div><div class="color3"></div><div class="color4"></div><div class="color5"></div><div class="color6"></div></div><div class="intierior"><div class="intierior1 in"></div><div class="intierior2"></div><div class="intierior3"></div></div></div>'
            ].join('\n') : [
                '<div class="ui_contro canvasUiContro_cal"><div class="vehicle"><div class="car1 in"><span></span>先锋版</div><div class="car2"><span></span>领先版</div><div class="car3"><span></span>豪华版</div><div class="car4"><span></span>旗舰版</div></div><div class="colorList"><div class="color1 in"></div><div class="color2"></div><div class="color3"></div><div class="color4"></div><div class="color5"></div><div class="color6"></div><div class="color7"></div></div><div class="intierior"><div class="intierior1 in"></div><div class="intierior2"></div></div></div>'
            ].join('\n')

            var div = document.createElement('div');
            div.id = "canvasUiContro";
            // div.innerHTML = [
            //     '<div class="canvasUiContro"><div class="vehicle"><div class="car1 in"><span></span>亚洲龙HEV</div><div class="car2"><span></span>亚洲龙汽油版</div></div><div class="colorList"><div class="color1 in"></div><div class="color2"></div><div class="color3"></div><div class="color4"></div><div class="color5"></div><div class="color6"></div></div><div class="intierior"><div class="intierior1 in"></div><div class="intierior2"></div><div class="intierior3"></div></div></div>'
            // ].join('\n');
            div.innerHTML = innerHTML;
            // splash wrapper
            box.appendChild(div);

            $(".ui_contro .vehicle>div").click(function () {
                $(this).addClass("in").siblings().removeClass("in");
                window.CAR_ID = $(this).index();
                if (CAR_TYPE_NAME) {
                    window.CAR_TYPE_NAME(window.CAR_ID);
                }
            })
            $(".ui_contro .colorList>div").click(function () {
                $(this).addClass("in").siblings().removeClass("in");
                window.CAR_COLOR_ID = $(this).index();
            })
            $(".ui_contro .intierior>div").click(function () {
                $(this).addClass("in").siblings().removeClass("in");
                window.CAR_INNER_ID = $(this).index();
            })
        }
        if (typeof e == 'number') {
            window.UIMODE = e;
            $(".ui_contro>div").eq(e).addClass("in").siblings().removeClass("in");
        }


    }

    window.reflow = reflow;




};

window.CANVAS_PLAY = CANVAS_PLAY;
window.initCanvas = function (carType, basePath) {
    window.ASSET_PREFIX = carType === 'avalon' ? `${basePath}canvas/` : carType === 'carolla' ? `${basePath}canvas-cal/` : '';
    window.CANVAS_PROPORTION = 1300 / 1430;//canvas尺寸比例
  window.CANVAS_PROPORTION = 1500 / 1400;//canvas尺寸比例
  window.SCRIPT_PREFIX = "";
    window.SCENE_PATH = carType === 'avalon' ? '667837.json' : carType === 'carolla' ? '670288.json' : '';
    window.CONTEXT_OPTIONS = {
        'antialias': true,
        'alpha': false,
        'preserveDrawingBuffer': false,
        'preferWebGl2': true
    };
    window.SCRIPTS = [15669277, 15617492, 15617476, 15617486, 15617493, 15633825, 15634151, 15634157, 15636246, 15648806, 15663864, 15666803, 15669114, 15669233, 15669240, 15669681, 15670751, 15670752, 15671978, 15672962, 15687381];
    window.CONFIG_FILENAME = window.ASSET_PREFIX + "config.json";
    window.ADD_CANVAS = "matchings";//需要将canvas添加到哪个ID中
    window.INPUT_SETTINGS = {
        useKeyboard: true,
        useMouse: true,
        useGamepads: false,
        useTouch: true
    };

    //加载完成后执行
    window.START_CANVAS = function () {
        // $(".neishi").fadeIn();
        window.UI_CONTRO_CANVAS(0, carType);
    }
    // //如果不支持webgl和加载超时后执行
    // window.NOT_SUPPORT_CANVAS = function () {
    // }
    // window.CAR_TYPE_NAME = function (e) {
    //     //选择车型时执行：0：混动版   1：汽油版
    //     return 0;
    // };
    pc.script.legacy = false;// eslint-disable-line no-undef
    // window.CANVAS_PLAY();

    // if (productId == '12595') {
    //   window.CANVAS_PLAY();
    // } else {
    //   window.reflow();
    // }
}
