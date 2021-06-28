/*
 * @Descripttion: 狐妖
 * @version: v1.0.0
 * @Author: bindy(128080)
 * @Date: 2021-05-17 16:06:18
 * @LastEditors: bindy(128080)
 * @LastEditTime: 2021-06-15 17:33:01
 */

/*手机横竖屏提示
     *@direction：横屏提示or竖屏提示 'horizontal'|'vertical'
     */
function tipFn(direction) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端

    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var orientationChange = function () {
        if (isAndroid) {
            if (window.screen.width < window.screen.height) {
                direction == "horizontal"
                    ? document.getElementById('tip').classList.add('hide')
                    : document.getElementById('tip').classList.remove('hide');
            }
            if (window.screen.width > window.screen.height) {
                direction == "horizontal"
                    ? document.getElementById('tip').classList.remove('hide')
                    : document.getElementById('tip').classList.add('hide');
            }
        } else if (isIOS) {
            if (window.orientation == 90 || window.orientation == -90) {
                //横屏
                direction == "horizontal"
                    ? document.getElementById('tip').classList.remove('hide')
                    : document.getElementById('tip').classList.add('hide');
            } else {
                //竖屏
                direction == "horizontal"
                    ? document.getElementById('tip').classList.add('hide')
                    : document.getElementById('tip').classList.remove('hide');
            }
        }
    };
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", orientationChange, false);
    orientationChange()
};

tipFn("horizontal")

//设置cookie
function setCookie(c_name, value) {
    var expiredays = 10000;
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

//取回cookie
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

var app = new Vue({
    el: '#app',
    data: {
        user: {
            nickname: 'abc',
            avatar: 'image/default-head.png'
        },
        broswer: Public.checkMobile(),

        btnAudio: new Audio(),
        cdAudio: new Audio(), bgAudio: null,
        pageState: true,// 页面状态是否后台
        isPlay: true,// 是否允许播放声音
        isPlaying: false,//是否已经播放 安卓
        dur: 1300,// 视频切换间隔 


        bindPc: true,// 绑定了PC
        bindKd: true,// 是否绑定了口袋

        realGift: false,// 实物周边奖励


        load: true,
        loadCount: 0,
        loadEnd: false,// 加载完毕


        activePage: 'index',
        prevPage: '',
        // 页面切换花花效果
        pageEnd: {
            index: false,
            cut: false,
            chose: false
        },

        prevVideo: '',// 上一个视频key
        curVideo: '',// 当前视频key
        curVideoSrc: '',// 当前视频的地址
        videoTime: null,
        showJump: false,// 是否显示混剪跳过按钮
        // videoEnd:false,// 当前视频是否播放完（锁屏开启是否重新播放）
        /* 视频控制 */
        video: {
            index1: {
                src: config.media + '1-1.mp4',// 首页视频
                loop: false,
                visibility: true,
                poster: config.img + '1-1.jpg'
            },
            index2: {
                src: config.media + '1-2.mp4',// 首页视频
                loop: true,
                visibility: false,
                poster: config.img + '1-2.jpg'
            },
            /*  index3: {
                 src: config.media + '1-3.mp4',// 首页视频
                 loop: false,
                 visibility: false
             }, */

            cut: {
                src: '',// config.media + '2.mp4',// 首页视频
                loop: false,
                visibility: false,
                poster: config.img + '2.jpg'
            },
            chose: {
                src: '',//config.media + '3.mp4',// 首页视频
                loop: false,
                visibility: false,
                poster: config.img + '3.jpg'
            },
        },
        indexLoopEnd: true,//首页循环视频播放完
        indexBtnStart: false,//是否显示首页的开始按钮
        canChose: true,//可以选择了助力方式
        callName: {
            '1': '白苏',
            '2': '月红'
        },
        curChoseCP: '1',// 为谁打call：1-白苏 2-月红
        curTool: 1,// 当前的道具， 1 2 3
        toolName: {
            // 一级cp
            '1': {
                // 二级 道具类型
                '1': {
                    'n':
                        '普通荧光棒',
                    't': '初级'
                },
                '2': {
                    'n': '五彩糖形状荧光棒',
                    't': '中级'
                },
                '3': {
                    'n': '白苏定制加油棒',
                    't': '高级'
                },
            },
            '2': {
                '1': {
                    'n': '普通荧光棒',
                    't': '初级'
                },
                '2': {
                    'n': '糖葫芦形状荧光棒',
                    't': '中级'
                },
                '3': {
                    'n': '月红定制加油棒',
                    't': '高级'
                },
            }
        }
        ,
        // 道具状态true 显示使用，false 显示去获得
        toolState: {
            "1": {
                "1": true,
                "2": true,
                "3": true,
            },
            "2": {
                "1": true,
                "2": true,
                "3": true,
            }
        },

        countdown: 3,// 游戏开头倒计时
        gameCountTime: 0,// 游戏计时
        isBeginShake: false,
        isShake: false,
        isGaming: false,
        shakeTimer: null,
        timer: null,
        isWmini: false,// 是小程序


        /* 弹窗控制 */
        prevPop: [],// 前一个弹窗
        curPop: null,// 当前弹窗
        pop: {
            toolSure: false,
            shareGet: false,
            bindState: false,
            shareTips: false,
            bind: false,
            address: false,
            phone: false,
            finish: false,
            choseGame: false,
            get: false,
            rule: false,
            record: false,
            gift: false,
            common: false,
            confirmBindPc: false,
            weappLogin: false,
            giftkd: false
        },
        popCommonMsg: '通用',
        popCommonCloseFn: function () {

        },
        bindTime: 0,// 验证码倒计时
        bindTiming: false,// 验证码倒计时ing
        codeTxt: '获取验证码',

        sharePage: '',// 分享页显示

        giftTab: 0,
        kdGiftTab: 0,

        screenImg: ''
    },
    methods: {

        /* 预加载 */
        preLoad: function () {
            for (var i = 0; i < config.imgList.length; i++) {
                var img = new Image()
                img.onload = this.onLoadHandler
                img.onerror = this.onLoadHandler

                img.src = config.img + config.imgList[i]
            }
        },

        onLoadHandler: function () {
            this.loadCount++;
            if (this.loadCount >= config.imgList.length) {
                // console.log('load end')
                this.loadEnd = true

            }
        },
        clickLoadEnd: function () {
            this.playAudio()
            this.load = false;
            this.togglePage('index')

            // this.togglePage('result')// TODO:111
            this.playBtn()
        },

        /* page */
        togglePage: function (key) {
            var self = this;
            if (this.pageEnd[this.prevPage]) {
                setTimeout(function () {
                    self.pageEnd[self.prevPage] = false
                }, this.dur)
            }
            this.pageEnd[this.prevPage] = true

            this.activePage = key;
            this.prevPage = this.activePage
            switch (key) {
                case 'index':
                    this.initPageIndex()
                    break;
                case 'cut':
                    this.initPageCut()
                    break;
                /* case 'chose':
                    this.initPageChose()
                    break; */
                case 'tools':
                    this.initPageTools()
                    break;
                case 'game':
                    this.initPageGame()
                    break;
                case 'result':
                    this.initPageResult()
                    break;

                default:
                    break;
            }
        },
        /* page index */
        initPageIndex: function () {
            this.indexEnd = false

            // this.playAudio()
            // setTimeout(function() {
            // document.getElementById('index2Video').pause()
            this.playVideo('1-1', 'index1', false)
            document.getElementById('index2Video').play()
            // }, 1);

            document.getElementById('index1Video').onended = this.indexVideoEnd1

            // document.getElementById('index2Video').onended = this.indexVideoEnd2
            // document.getElementById('index3Video').onended = this.indexVideoEnd3

            // document.getElementById('index2Video').onloadstart = console.log("Starting to load video");
            // document.getElementById('index2Video').onprogress = console.log("Downloading video");
            // document.getElementById('index2Video').oncanplay = console.log("oncanplay video");
            // document.getElementById('index2Video').oncanplaythrough = console.log("oncanplaythrough video");
        },
        indexVideoEnd1: function (e) {
            if (this.activePage == 'index') {
                // if (this.broswer.android) {// 全都当前播放，ios12都要点击才行 // （x）安卓要当前播放
                this.playVideo('1-2', 'index1', true)
                document.getElementById('index2Video').pause()
                // } else {
                //     this.playVideo('1-2', 'index2', true)
                // }
                this.indexBtnStart = true
            }
            document.getElementById('index1Video').onended = null;

        },
        /* indexVideoEnd2: function () {
            // console.log('222 end')
            if (this.indexLoopEnd) {
                this.indexBtnStart = false

                this.playVideo('1-3', 'index3', false)
            }
        },
          indexVideoEnd3: function () {
              this.togglePage('chose')
          }, */
        clickToCut: function () {
            if (this.activePage != 'index') {
                return
            }
            /*  this.indexBtnStart = false
             this.indexLoopEnd = true */
            this.togglePage('cut')
            this.video.index2.loop = false
            this.playBtn()
        },
        /* page cut */
        initPageCut: function () {
            var self = this;
            document.getElementById('index1Video').onended = null;

            this.canChose = false

            this.pauseAudio()

            this.playVideo(config.cutv, 'cut', false, function () { }, this.dur, true)
            this.video.chose.src = config.media + '3.mp4'
            setTimeout(function () {
                /* 安卓小程序会清storage */
                // self.showJump = !!window.localStorage.getItem('jump')
                self.showJump = !!getCookie('jump') || !!window.localStorage.getItem('jump')
                // self.showJump = true;// 判断是否显示跳过按钮，第一次不显示
            }, 1000);
            setTimeout(function () {
                // 悄悄播放预加载一下
                document.getElementById('choseVideo').play()
            }, 13000);
            document.getElementById('cutVideo').onended = this.cutVideoEnd
        },
        /* (5-25版本，chose是当页)page chose */
        /*  initPageChose: function () {
             document.getElementById('cutVideo').onended = null;
             
             var self = this;
             this.playAudio()
             if (this.showJump) {
                 this.playVideo('3', 'chose', false)
                 document.getElementById('choseVideo').onended = this.choseVideoEnd
             }
             setTimeout(function () {
                 self.canChose = true;
             }, 14000);
         }, */
        cutVideoEnd: function (e) {
            /* 安卓切换到chose page就不播放了，改成当页切换视频 
            // this.togglePage('chose')*/

            var self = this;
            this.playAudio()
            /* ffffff */
            // if (this.showJump) {
            // this.playVideo('3', 'cut', false)
            // if (this.broswer.android) {// 安卓要当前播放
            this.playVideo('3', 'cut', false)
            document.getElementById('choseVideo').pause()

            document.getElementById('cutVideo').onended = this.choseVideoEnd
            document.getElementById('cutVideo').ontimeupdate = function (e) {
                self.choseVideoChange(e)
            }
            document.getElementById('cutVideo').onclick = function () {
                document.getElementById('cutVideo').play();
                document.getElementById('cutVideo').onclick = null
            }
            /* } else {
                this.playVideo('3', 'chose', false)
                document.getElementById('choseVideo').onended = this.choseVideoEnd
                 document.getElementById('choseVideo').ontimeupdate =function (e) {
                        self.choseVideoChange(e)
                    } 

                    document.getElementById('choseVideo').onclick = function () {
                        document.getElementById('choseVideo').play();
                        document.getElementById('choseVideo').onclick = null
                    }
            } */

            /* } else {
                self.canChose = true;
               
            } */

        },
        choseVideoClick: function () {
            document.getElementById('cutVideo').ontimeupdate = null
            document.getElementById('cutVideo').onclick = null

            this.canChose = true;

            // document.getElementById('choseVideo').ontimeupdate = null;
            // document.getElementById('choseVideo').onclick = null
        },
        choseVideoChange: function (e) {
            if (e.currentTarget.currentTime > 14) {
                console.log('ppp')
                // this.choseVideoClick()
                this.choseVideoEnd()
            }
        },
        // QA的安卓不会走这个回调 放到14s调用
        choseVideoEnd: function (e) {
            /* 3.mp4播完 *///this.canChose = true;
            this.showJump = false;
            this.choseVideoClick()

            this.setJumpState()
        },
        /* ffffff */

        /* 设置第一次看完了 */
        setJumpState: function () {
            console.log('jump', Number(true))
            window.localStorage.setItem('jump', Number(true))
            setCookie('jump', Number(true))
        },
        // 打call
        clickCall: function (index) {
            if (!this.canChose) {
                return;
            }
            // console.log('call', index)
            this.curChoseCP = index
            this.togglePage('tools')
            this.playBtn()

        },
        /* 选道具 */
        initPageTools() {
            this.pauseVideo('cut')
            document.getElementById('cutVideo').onended = null

        },
        clickTool(id) {
            this.curTool = id;
            this.showPop('toolSure')
            this.playBtn()

        },
        /* 去获得 */
        clickGetTool(id) {
            if (id == 3) {
                // 定制加油棒
                this.showPop('bindState')
            } else {
                this.showPop('shareGet')
            }
        },
        clickToGame() {
            this.iosGrantedTips()
            this.playBtn()
            //this.togglePage('game')
        },
        /* 游戏页面 */
        initPageGame() {
            // 开始倒计时
            this.countdown = 4;
            var self = this;
            setTimeout(function () {
                self.countDownTime()
                self.playCd()
            }
                , 1000);


        },
        countDownTime() {

            this.countdown--;
            if (this.countdown > 0) {
                setTimeout(this.countDownTime, 1000);
            } else {
                // 倒计时结束 游戏开始
                this.gameStart()
            }
        },

        gameStart() {
            this.isGaming = true;
            this.isBeginShake = false;
            this.isShake = true;
            this.gameCountTime = 0;

            //游戏时长计时
            setTimeout(this.gameCountTimer, 1000);
            // this.gameCountTimer()
            this.shake()
        },
        // 摇一摇权限
        iosGrantedTips() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("like mac os x") > 0) {
                var verinfo = ua.match(/cpu iphone os (.*?) like mac os/);
                var version = verinfo[1].replace(/_/g, ".");
                console.log('version', version)
                var arr = version.split(".");
                if ((arr[0] > 12 && arr[0] <= 13 && arr[1] > 2) || arr[0] >= 14) {  //对13.3以后的版本处理,包括13.3,

                    this.ios13granted()

                    return;
                }
            }

            //13.3以前的版本或者安卓
            this.iosDeviceGranted()
        },
        ios13granted() {
            var self = this
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().then((permissionState) => {
                    /* granted（被授予），denied（被拒绝） 或者default（默认） */
                    // console.log('p', permissionState)
                    if (permissionState === 'granted') {
                        self.iosDeviceGranted()
                    } else {
                        // alert(1)
                        self.iosDeviceDenied()
                    }
                }).catch((err) => {
                    self.iosDeviceDenied()
                    // alert(JSON.stringify(err))
                })
            } else {
                // 处理常规的非iOS 13+设备
                self.iosDeviceGranted()
            }
        },
        // 授权完可以开始游戏
        iosDeviceGranted() {
            this.togglePage('game')

            this.closePop('toolSure', true)
        },
        // 如果ios被拒绝
        iosDeviceDenied() {
            alert("您未允许权限，请将App关闭或者清除缓存后重新访问授权");
        },
        gameCountTimer() {
            this.gameCountTime++;
            if (this.isGaming) {
                this.timer = setTimeout(this.gameCountTimer, 1000);
            }
            // 3s没有在摇动，游戏结束
            if (this.gameCountTime == 3 && !this.isBeginShake) {
                this.isShake = false
            }
            if (!this.isShake) {
                this.gameEnd();
            }
        },
        shake() {
            var self = this;
            var SHAKE_THRESHOLD = 3000; // 用来判定的加速度阈值，太大了则很难触发
            var last_update = 0;
            var x, y, z, last_x = 0,
                last_y = 0,
                last_z = 0;
            // 判断是否支持摇动
            // if (window.DeviceMotionEvent) {
            window.ondevicemotion = deviceMotionHandler
            // window.addEventListener('devicemotion', deviceMotionHandler, false);
            // }
            //摇动函数
            function deviceMotionHandler(eventData) {
                var acceleration = eventData.accelerationIncludingGravity;
                var curTime = new Date().getTime();
                if ((curTime - last_update) > 10) {
                    var diffTime = curTime - last_update;
                    last_update = curTime;
                    x = acceleration.x;
                    y = acceleration.y;
                    z = acceleration.z;
                    var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
                    //判断摇动的速度大于阈值，则在摇动
                    if (speed > SHAKE_THRESHOLD) {
                        // console.log('shake', speed);
                        self.isShake = true;
                        if (!self.isBeginShake) {
                            self.isBeginShake = true;
                        }
                        clearTimeout(self.shakeTimer);
                        //判断下一次的摇一摇
                        self.shakeTimer = setTimeout(function () {
                            self.isShake = false;
                        }, 600);
                    }
                    last_x = x;
                    last_y = y;
                    last_z = z;
                }
            }
        },
        gameEnd() {
            //手机震动1秒
            if (navigator.vibrate) {
                navigator.vibrate(1000);//震动秒数
            } else if (navigator.webkitVibrate) {
                navigator.webkitVibrate(1000);
            } else {
                console.log('不支持震动')
            }

            console.log('game over');
            window.ondevicemotion = null
            this.isGaming = false

            clearTimeout(this.timer);
            clearTimeout(this.shakeTimer);

            this.showPop('get', false, true)

            this.togglePage('result')
        },

        // 结果页
        initPageResult() {
            var self = this;
            // canvas
            document.querySelector('#result .no-scale').innerHTML = document.querySelector('#result .scale').innerHTML
            setTimeout(() => {
                html2canvas(document.querySelector("#result .no-scale"), {
                    width: window.innerWidth,
                    height: Math.max(window.innerHeight,1300),
                    useCORS: true
                }).then(canvas => {
                    var url = canvas.toDataURL();//图片地址
                    self.screenImg = url
                });
            }, 500);

        },

        /* video & audio */
        clearVideo() {
            for (var key in this.video) {
                this.video[key] = ''
            }
        },
        playVideo(n, id, loop, fn, time, nomuted) {
            // this.clearVideo()
            var self = this;
            this.prevVideo = this.curVideo;
            this.curVideo = id
            this.curVideoSrc = n;
            console.log('cur video:', this.curVideo)
            this.video[id].src = config.media + n + '.mp4'
            this.video[id].poster = config.img + n + '.jpg'
            this.video[id].loop = loop
            this.video[id].visibility = true




            if (this.videoTime) {
                clearTimeout(this.videoTime)
            }
            this.videoTime = setTimeout(function () {
                if (self.prevVideo && self.prevVideo != self.curVideo) {
                    self.pauseVideo(self.prevVideo)
                }
                fn && fn()
            }, time || 2);


            setTimeout(function () {
                var v = document.getElementById(id + 'Video')
                v.currentTime = 0;
                v.play()
                if (self.isPlay && nomuted) {
                    v.muted = false
                } else {
                    v.muted = true
                }
            }, 1);
        },
        pauseVideo(key) {
            var self = this;
            setTimeout(function () {
                self.video[key].visibility = false
                self.video[key].src = ''
            }, 10);
            document.getElementById(key + 'Video').pause()
        },
        playMedia() {
            if (this.isPlay) {
                if (this.curVideo) {
                    var v = document.getElementById(this.curVideo + 'Video')
                    // console.log('playMedia', v.duration, v.currentTime)

                    if (isNaN(v.duration) || v.duration - 1 > v.currentTime) {
                        v.play()
                    } else {
                        v.currentTime = v.duration - 1
                    }

                }
                if (this.curVideoSrc != config.cutv) {
                    this.playAudio()
                }
            }
        },
        pauseMedia() {
            this.pauseAudio()
            if (this.curVideo) {
                var v = document.getElementById(this.curVideo + 'Video')
                // console.log('pauseMedia', v.duration, v.currentTime)
                // if (v.duration - 1 > v.currentTime) {
                v.pause()
                // }

            }
        },
        clickMusic() {
            if (this.isPlay) {// 声音禁
                this.isPlay = false;
                if (this.curVideoSrc == config.cutv) {
                    document.getElementById(this.curVideo + 'Video').muted = true
                } else {
                    this.pauseAudio()
                }

            } else {// 声音开
                this.isPlay = true;
                if (this.curVideoSrc == config.cutv) {
                    document.getElementById(this.curVideo + 'Video').muted = false
                } else {
                    this.playAudio()
                }
            }
        },
        playAudio() {
            if (this.isPlay) {
                if (!this.broswer.android) {
                    document.getElementById('audio').play()
                } else {
                    if (!this.isPlaying) {
                        this.bgAudio.play()
                        this.isPlaying = true
                    }
                }
            }
        },
        pauseAudio() {
            // console.log('pause')
            if (!this.broswer.android) {
                document.getElementById('audio').pause()
            } else {
                this.bgAudio.pause()
                this.isPlaying = false
            }
        },

        playBtn() {
            if (this.isPlay) {
                this.btnAudio.play()
                // console.log('btnAudio')
            }
        },
        playCd() {
            if (this.isPlay) {
                this.cdAudio.play()
                // console.log('cdAudio')
            }
        },
        initAudio() {
            this.btnAudio = new Howl({
                src: [config.media + config.btn]
            })
            this.cdAudio = new Howl({
                src: [config.media + config.cd]
            })
            if (!this.broswer.android) {
                this.bgAudio = document.getElementById('audio')
                console.log('audio tag')
                if (this.isPlay) {
                    this.bgAudio.play()
                } else {
                    this.bgAudio.pause()
                }
            } else {
                // 安卓视频播放时会没有背景音乐用web audio
                this.bgAudio = new Howl({
                    src: [config.media + config.audio],
                    autoplay: this.isPlay,
                    loop: true,
                    // volume: 0.5,
                    pool: 0
                })

                this.bgAudio.once('play', function () {
                })
                this.isPlaying = true;
                document.getElementById('audio').pause()

                console.log('audio Howl')

            }
            // console.log(this.bgAudio, this.bgAudio.paused)
            // this.btnAudio.src = config.media + config.btn
            // this.cdAudio.src = config.media + config.cd
        },
        // 跳过动画
        clickJumpVideo() {
            if (this.showJump) {
                this.canChose = true;
                this.playAudio()

                this.showJump = false;

                // this.togglePage('chose')
                // var self = this;

                this.pauseVideo('cut')
                this.pauseVideo('chose')
                this.curVideoSrc = ''
                /* 安卓的跳过视频无效-改为直接显示最后一帧背景图 */
                /* this.playVideo('3', 'cut', false, function () {
                       var a = document.getElementById('choseVideo')
                      a.currentTime = a.duration -10
                      a.pause()
                      console.log('jjjjjj')
                 }) */
            }
            this.playBtn()
        },


        /* 弹窗 */
        closePop(key, noeffect) {
            key = key || this.curPop
            this.pop[key] = false
            this.curPop = null;
            if (this.prevPop[this.prevPop.length - 1]) {
                // 打开前弹窗
                this.curPop = this.prevPop[this.prevPop.length - 1]
                this.pop[this.curPop] = true
                this.prevPop.length = this.prevPop.length - 1
            }

            if (!noeffect) {
                this.playBtn()
            }
            // this.bindTime = 0
        },
        showPop(key, noprev, noeffect) {
            // noprev true 不需要存当前弹窗(替换弹窗)
            if (!noprev && this.curPop) {// 默认存当前弹窗
                this.prevPop[this.prevPop.length] = this.curPop
                // 当前弹窗关闭
                this.pop[this.curPop] = false
            } else {
                // this.prevPop = null
                this.prevPop[this.prevPop.length] = ''// 存一个空的进去
            }
            this.curPop = key
            this.pop[key] = true
            if (!noeffect) {// 默认要播放音效
                this.playBtn()
            }
        },
        // 通用弹窗
        showCommonPop(msg, noprev, closeFn) {
            this.popCommonMsg = msg
            // this.pop['common'] = true
            this.showPop('common', noprev)
            this.popCommonCloseFn = closeFn
        },
        closeCommonPop() {
            // this.pop['common'] = false
            this.closePop()
            if (this.popCommonCloseFn) {
                this.popCommonCloseFn()
                this.popCommonCloseFn = null
            }
        },
        // 分享引导
        showShareTips() {
            this.pop['shareTips'] = true;
            // 微信小程序配置 test
            if (this.isWmini) {

            }
            this.playBtn()
        },
        closeShareTips() {
            this.pop['shareTips'] = false;
        },
        // 游戏结束弹窗的关闭跳首页
        closeGetPop() {
            this.closePop()
            // this.togglePage('result')
        },
        clickGetCode() {

            if (this.bindTiming) {
                return
            }
            if (this.bindTime == 0) {
                setTimeout(this.codeTimer, 1000);
            }
            this.bindTiming = true
            this.bindTime = 60;
            this.playBtn()
        },
        codeTimer() {
            this.bindTime--;
            if (this.bindTime > 0) {
                setTimeout(this.codeTimer, 1000);
                this.codeTxt = this.bindTime + 's';
            } else {
                this.codeTxt = '获取验证码';
                this.bindTiming = false
            }
        },
        /* 前去绑定 */
        clickToBind() {
            if (!this.bindKd && !this.bindPc) {
                this.showPop('choseGame')
                this.playBtn()
            } else if (!this.bindKd) {
                this.toBindPc()
            } else {
                this.toBindKd()
            }
        },
        toBindPc() {
            this.showPop('bind')
            this.playBtn()
        },
        toBindKd() {
            /*  ①未绑定用户：点击绑定跳转至会员中心，绑定过后跳转回活动页面。
        ②已绑定过的用户，跳出确认弹窗，需要玩家进行确认是否按照原绑定账号还是修改： */
            this.showPop('phone')


            this.playBtn()
        },
        /* 小程序一键登录 */
        weappLogin() {
            this.playBtn()
            mobalogin.show()
            // TODO:存到yl代码那边
            // 存一下当前的音频状态
            window.localStorage.setItem('towxlogin', 1)
            window.localStorage.setItem('sound', this.isPlay)

            // wx.miniProgram.navigateTo({ url: '/pages/h5login/h5login' })
        },
        // 立即绑定
        clickBind() {
            this.playBtn()

        },
        clickHowBind() {
            this.playBtn()

            this.showCommonPop('在《英魂之刃》客户端首页点击个人头像-个人信息-帐号信息-复制角色ID')
        },

        /* 去首页 */
        clickToHome() {
            this.playBtn()
            this.togglePage('index')
        },
        /* 页面隐藏 */
        pageHide() {
            if (!this.pageState) {
                return;
            }
            this.pageState = false;
            // 音频
            this.pauseMedia();
        },
        /* 页面显示 */
        pageShow() {
            if (this.pageState) {
                return;
            }
            this.pageState = true;
            this.playMedia();
        },



        indexCreatedHandler() {
            /* 由于内联视频的兼容性不确定，建议限制用户在QQ和微信中打开，其余跳转二维码页面引导 */
            /* NOTE:地址，?nm=1 就不会跳走了 方便电脑调试啦~ */
            /*  if (!Public.GetQueryString('nm') && !(this.broswer.wechat || this.broswer.qq)) {
                 window.location.href = 'share.html'
             } */


            var isToBindPage = !!Number(window.localStorage.getItem('towxlogin'))
            if (isToBindPage) {
                this.isPlay = !!Number(window.localStorage.getItem('sound'))
                console.log('A', this.isPlay, isToBindPage)
                window.localStorage.removeItem('towxlogin')
                window.localStorage.removeItem('sound')
            }

            this.initAudio()



            var self = this;
            this.preLoad()


            try {
                /* 仅限安卓， ios会判断成微信在后台 */
                if (this.app.broswer.android) {
                    wx.ready(function () {
                        WeixinJSBridge.on('onPageStateChange', function (res) {
                            if (res.active == 'true') {
                                console.log('wx show')
                                self.pageShow()
                            } else {
                                console.log('wx hide')
                                self.pageHide()
                            }
                        })

                    });
                }
            } catch (error) {

            }
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === 'hidden') {
                    //切到后台
                    console.log('page hide')
                    self.pageHide()
                } else if (document.visibilityState === 'visible') {
                    //切到前台
                    console.log('page show')
                    self.pageShow()
                }
            });

            if (this.isPlaying) {
                this.playMedia()
                document.addEventListener(
                    "WeixinJSBridgeReady",
                    this.playMedia,
                    false
                );
            }



            /* 判断小程序环境 */
            wx.miniProgram.getEnv(function (res) {
                console.log('res.miniprogram', res.miniprogram) // true
                self.isWmini = true
                // 设置分享
                /* weixin.initShare({
                    title: '7月2日高甜联动来袭！',
                    // url: '',
                    imageUrl: 'https://img9.99.com/moba/2021/4/8/222.jpg'
                }) */
                // 解析sid
                var sid = Public.GetQueryString('sid')
                console.log('sid', sid)
                // 是否刚刚绑定完
                var mina = !!Number(Public.GetQueryString('mina'))
                console.log('mina', mina)
                if (mina) {
                    self.showPop('phone')
                }
            })

            // this.showPop('get')

            // start
            // TODO:为了展示，解析地址代码(要删掉) 
            // 快速设置去第几页测试
            var to = Public.GetQueryString('to')
            if (to) {
                this.load = false;
                this.togglePage(to)
            }
            // 设置道具获得状态
            var get = !!Number(Public.GetQueryString('t'))
            this.toolState[1][2] = this.toolState[1][3] = this.toolState[2][2] = this.toolState[2][3] = get
            // 是否小程序
            this.isWmini = !!Number(Public.GetQueryString('w'));

            // 英魂PC绑定
            this.bindPc = !!Number(Public.GetQueryString('pc'))
            // 英魂KD绑定
            this.bindKd = !!Number(Public.GetQueryString('kd'))

            // 实物奖励
            this.realGift = !!Number(Public.GetQueryString('g'))
            // end
        },
        shareCreatedHandler() {
            // start
            // TODO:为了展示，解析地址代码(可删掉)
            // 快速设置去哪一页
            var p = !!Number(Public.GetQueryString('p')) || 'share'
            this.sharePage = p
            // end
        }

    },
    created: function () {

        var appcls = document.getElementById('app').classList;
        if (appcls.contains('app-index')) {
            // 首页
            this.indexCreatedHandler()
        } else if (appcls.contains('app-share')) {
            // 分享
            this.shareCreatedHandler()
        }

    },
    computed: {
        /* 加载进度 */
        loadP: function () {
            return Math.ceil(this.loadCount / config.imgList.length * 100)
        },
        /* 音频资源地址 */
        audioSrc: function () {
            return !this.broswer.android ? config.media + config.audio : ''
        },
        /* 道具图片 */
        toolimg1: function () {
            return config.img + 't-' + this.curChoseCP + '-1.png'
        },
        toolimg2: function () {
            return config.img + 't-' + this.curChoseCP + '-2.png'
        },
        toolimg3: function () {
            return config.img + 't-' + this.curChoseCP + '-3.png'
        },
        /* 当前选择的道具 */
        curToolSrc: function () {
            return config.img + 't-' + this.curChoseCP + '-' + this.curTool + '.png'
        },
        /* 游戏倒计时 */
        cdCls: function () {
            return 'cd-' + this.countdown
        },
        /* 游戏计时 */
        gameTime: function () {
            h = Math.floor(this.gameCountTime / 3600) % 100;
            m = Math.floor(this.gameCountTime / 60) % 60;
            s = this.gameCountTime % 60;
            //判断是否小于10，要补0
            if (h < 10) {
                h = '0' + h;
            }
            if (s < 10) {
                s = '0' + s;
            }
            if (m < 10) {
                m = '0' + m;
            }
            return h + ':' + m + ':' + s
        },
        /* 游戏手 */
        gameHandCls: function () {
            return 'hand-' + this.curChoseCP + '-' + this.curTool
        },
        /* 排名 */
        gameRankNum: function () {
            var a = 0;
            switch (true) {
                case this.gameCountTime >= 0 && this.gameCountTime < 4:
                    a = 10
                    break;
                case this.gameCountTime >= 4 && this.gameCountTime < 7:
                    a = 20
                    break;
                case this.gameCountTime >= 7 && this.gameCountTime < 11:
                    a = 30
                    break;
                case this.gameCountTime >= 11 && this.gameCountTime < 16:
                    a = 60
                    break;
                case this.gameCountTime >= 16 && this.gameCountTime < 20:
                    a = 80
                    break;
                case this.gameCountTime >= 20:
                    a = 95
                    break;

                default:
                    break;
            }
            return a
        }
    }
})
