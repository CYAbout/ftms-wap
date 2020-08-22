/**
 * 图片上传工具类
 * 依赖 webuploader 项目
 * by lib
 */
var Ctower = Ctower || {};
/**
 * Adds all missing properties from second obj to first obj
 */
Ctower.extend = function (first, second) {
    for (var prop in second) {
        first[prop] = second[prop];
    }
};

var Ctower = Ctower || {};

var UtilDate = {
    //获取当前时间
    getFormatDate: function(date, type) {
        if (typeof(date) == "string") {
            date = (date == "") ? new Date() : (new Date(String(date).replace(/-/g, '/')));
        }else if(!isNaN(date)){
            date = this.timesToDate(date);
        }
        Date.prototype.Format = function(fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        };

        if (type === "datetime") {
            return date.Format("yyyy-MM-dd hh:mm:ss");
        } else if (type === "day") {
            return date.Format("yyyy-MM-dd");
        } else if (type === "month") {
            return date.Format("yyyy-MM");
        } else if (type === "time") {
            return date.Format("hh:mm");
        }
    },
    timesToDate: function(times) {
        return new Date(times);
    }
};

/**
 * Creates upload button, validates upload, but doesn't create file list or dd.
 */
Ctower.FileUploaderBase = function (o) {
    this._options = {
        //framework.url
        FRAMEWORK_URL: '',
        //服务端地址
        CONTEXT_PATH: '',
        // 选完文件后，是否自动上传
        auto: true,
        //可编辑
        editable: true,
        //是否显示文件名称
        showName: true,
        // swf文件路径
        swf: 'Uploader.swf',
        //swf: '/framework/js/webuploader/Uploader.swf',
        // 文件接收服务端。
        server: '', //图片上传接口地址
        //server: 'mall/userLogo/uploadCommentImgWeb.do', //评价
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',
        //显示文件的控件名称
        fileList: '#fileList',
        fileNumLimit: 1,//验证文件总数量
        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'//image/*
            //mimeTypes:'image/*,text/plain,application/msword,application/octet-stream,application/vnd.ms-excel,application/x-shockwave-flash'
        },
        // 优化retina, 在retina下这个值是2
        ratio: window.devicePixelRatio || 1,
        // 缩略图大小
        thumbnailWidth: 100,
        thumbnailHeight: 100,
        //多文件上传
        multiple: false,
        duplicate:true, //实现重复上传
        //当有文件添加进来的时候
        onFileQueued: function (file) {},
        //文件上传成功
        onUploadSuccess: function (file) {},
        //文件上传失败
        onUploadError: function (file) {},
        //完成上传完了，成功或者失败
        onUploadComplete: function (file) {},
        //完成删除文件
        onRemoveComplete: function (file) {},
        //上传进度
        uploadProgress: function (file, percentage) {}
    };
    this._webuploader = null;
    Ctower.extend(this._options, o);
};

Ctower.FileUploaderBase.prototype = {
    setParams: function (params) {
        this._options.params = params;
    }
};

/**
 * Class that creates upload widget with drag-and-drop and file list
 *
 * @inherits qq.FileUploaderBase
 */
Ctower.FileUploader = function (o) {
    Ctower.FileUploaderBase.apply(this, arguments);
    Ctower.extend(this._options, o);
    var onlyImg = o.onlyImg || false;

    var _this = this;

    //初始化 webuploader
    this.getUploader = function () {
        if (this._webuploader) {
            return this._webuploader;
        } else {
            // 初始化Web Uploader
            var webuploader = WebUploader.create({
                auto: this._options.auto,
                swf: this._options.FRAMEWORK_URL + this._options.swf,
                server: this._options.CONTEXT_PATH + this._options.server,
                pick: this._options.pick,
                accept: this._options.accept,
                fileNumLimit:this._options.fileNumLimit,
                duplicate:this._options.duplicate //实现重复上传
            });

            this._webuploader = webuploader;
        }
        return this._webuploader;
    };


    // 负责view的销毁
    this.removeFile = function (file) {
        var $li = $('#' + file.id);
        //delete percentages[ file.id ];
        //updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();

        var webuploader = this.getUploader();
        try {
            //uploader removeFile
            webuploader.removeFile(file);
        } catch (e) {
        }
        //回调
        _this._options.onRemoveComplete(file);
    };

    /**
     * 创建图片展示信息
     */
    this.createView = function (file) {
        if (!file.name) return;

        var $fileList = $(this._options.fileList);

        var $li = null;

        //可编辑 div list
        if(o.editable){
            $li = $('<div  id="'+ file.id +'" class="img-item">'+
                    '<em class="bm-btnClose close-btn" id="del_'+ file.id +'"></em>'+
                    '<img  id="img_'+ file.id +'" />'+
                '</div>'
            );
        }

        //只是图片
        if (onlyImg) {
            $li = $('<img id="' + file.id + '" width="30" height="30" />');
        }

        //是否显示文件名
        if (this._options.showName && !onlyImg) {
            $('<span class="info">' + file.name + '</span>').appendTo($li);
        }

        // $list为容器jQuery实例
        if (this._options.multiple) {
            //多文件上传
            $fileList.append($li);
        }
        else {
            $fileList.html($li);
        }
    };

    //显示缩略图
    this.showThumb = function (file) {
        _this.createView(file);

        // 缩略图大小
        var thumbnailWidth = this._options.thumbnailWidth;
        var thumbnailHeight = this._options.thumbnailHeight;

        if (file.src) {
            var $li = $('#' + file.id);
            var $img = $li.find('img');
            if (onlyImg) {
                $img = $('#' + file.id);
            }
            $img.attr('src', file.src);
            $img.attr({width: thumbnailWidth, height: thumbnailHeight});
        }
    };


    //显示缩略图
    this.makeThumb = function (file) {
        _this.createView(file);

        // 缩略图大小
        var thumbnailWidth = this._options.thumbnailWidth * this._options.ratio;
        var thumbnailHeight = this._options.thumbnailHeight * this._options.ratio;
        this._options.thumbnailWidth = thumbnailWidth;
        this._options.thumbnailHeight = thumbnailHeight;

        //初始化
        var webuploader = this.getUploader();

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        webuploader.makeThumb(file, function (error, src) {
            var $li = $('#' + file.id);
            var $img = $li.find('img');
            if (onlyImg) {
                $img = $('#' + file.id);
            }
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr('src', src);
        }, thumbnailWidth, thumbnailHeight);

    };

    this.upload = function () {
        //初始化
        var webuploader = this.getUploader();
        webuploader.upload();
    };

    this.stop = function () {
        //初始化
        var webuploader = this.getUploader();
        webuploader.stop();
    };

    var uploader = this;
    return {
        //初始化
        init: function () {
            uploader._initUploader();
        },
        //显示图片缩略图
        showThumb: function (file) {
            uploader.showThumb(file)
        },
        //手动上传
        upload: function () {
            uploader.upload()
        },
        //停止上传
        stop: function () {
            uploader.stop()
        },
        //当有文件添加进来的时候
        onFileQueued: function (func) {
            uploader._options.onFileQueued = func;
        },
        //文件上传成功
        onUploadSuccess: function (func) {
            uploader._options.onUploadSuccess = func;
        },
        //文件上传失败
        onUploadError: function (func) {
            uploader._options.onUploadError = func;
        },
        //完成上传完了，成功或者失败
        onUploadComplete: function (func) {
            uploader._options.onUploadComplete = func;
        },
        //完成删除
        onRemoveComplete: function (func) {
            uploader._options.onRemoveComplete = func;
        },
        //上传进度
        uploadProgress: function (func) {
            uploader._options.uploadProgress = func;
        }
    };
};

//inherit from Basic Uploader
Ctower.extend(Ctower.FileUploader.prototype, Ctower.FileUploaderBase.prototype);

Ctower.extend(
    Ctower.FileUploader.prototype,
    {
        _initUploader: function () {
            var handler = this;

            //初始化
            var webuploader = handler.getUploader();

            // 当有文件添加进来的时候
            var onFileQueuedFunc = handler._options.onFileQueued;
            webuploader.on('fileQueued', function (file) {
                handler.makeThumb(file);
                onFileQueuedFunc(file);
            });

            // 文件上传过程中创建进度条实时显示。
            var uploadProgress = handler._options.uploadProgress;
            webuploader.on('uploadProgress', function (file, percentage) {
                uploadProgress(file, percentage);
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            var onUploadSuccess = this._options.onUploadSuccess;
            webuploader.on('uploadSuccess', function (file, rec) {
                file.oId = file.id;
                file.datestr = UtilDate.getFormatDate(new Date(), 'day');

                //返回结果
                file.url = rec.url;
                file.title = rec.title;
                file.path = rec.path;
                file.size = rec.size;
                file.original = rec.original;
                file.state = rec.state;
                file.type = rec.type;

                onUploadSuccess(file);
            });

            // 文件上传失败，显示上传出错。
            var onUploadError = this._options.onUploadError;
            webuploader.on('uploadError', function (file) {
                onUploadError(file);
            });

            // 完成上传完了，成功或者失败，先删除进度条。
            var onUploadComplete = this._options.onUploadComplete;
            webuploader.on('uploadComplete', function (file) {
                onUploadComplete(file);
            });
        }
    });
