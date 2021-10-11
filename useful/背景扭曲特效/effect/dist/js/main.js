/*
 * Author: 
 * Version: 0.1.0
 * Compile Date: 2017-12-22 17:32
*/ 
requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (e) {
        window.setTimeout(e, 1e3 / 60, (new Date).getTime())
    }
}()

$(function () {
    var isLowIe = false;
    var w = 1920, h = 1080;
    var stage, renderer, imgCon, displacementMap, displacementMap2, d, e, c, shader;
    var mapCur, mapOld, mapArr;
    var isAni = !1;
    var t = {
        vertexShader: ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "varying vec2 vTextureCoord;", "uniform mat3 projectionMatrix;", "void main() {", "gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);", "vTextureCoord = aTextureCoord;", "}"].join("\n"),
        fragmentShader: ["precision highp float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler;", "uniform sampler2D displacementMap;", "uniform sampler2D displacementMap2;", "uniform float time;", "uniform float elapsed;", "uniform float width;", "uniform vec2 resolution;", "uniform float scale;", "float snoise(vec2 co, float seed) {", "return fract(sin(dot(co * seed, vec2(12.9898, 78.233))) * 43758.5453);", "}", "void main() {", "vec2 repeat = vec2(scale, scale * resolution.y / resolution.x);", "vec2 uv = gl_FragCoord.xy / vec2(resolution.x, resolution.y);", "vec2 vCoord = fract(uv.xy * repeat.xy);", "vec4 displacement1 = texture2D( displacementMap, vCoord);", "vec4 displacement2 = texture2D( displacementMap2, vCoord);", "vec4 displacement = mix(displacement1, displacement2, vec4(time));", "vec2 mixTexture = mix(displacement.xy, vTextureCoord.xy, vec2(time));", "vec2 testPos1 = mixTexture + (1.0 - time) * displacement.xy * 0.5;", "vec2 testPos = mix(testPos1, vec2(1.0), vec2(1.0 - time));", "vec2 distUv = vec2(vTextureCoord.x, testPos.y);", "float noise = snoise(distUv, elapsed);", "vec4 color = texture2D(uSampler, distUv);", "gl_FragColor = vec4(mix(color, vec4(vec3(color * noise), 0.0), 0.18));", "}"].join("\n"),
        simpleFragmentShader: ["precision highp float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler;", "uniform sampler2D displacementMap;", "uniform sampler2D displacementMap2;", "uniform float time;", "uniform float elapsed;", "uniform float width;", "uniform vec2 resolution;", "uniform float scale;", "float snoise(vec2 co, float seed) {", "return fract(sin(dot(co * seed, vec2(12.9898, 78.233))) * 43758.5453);", "}", "void main() {", "vec2 repeat = vec2(scale, scale * resolution.y / resolution.x);", "vec2 uv = gl_FragCoord.xy / vec2(resolution.x, resolution.y);", "float noise = snoise(vTextureCoord, elapsed);", "vec4 color = texture2D(uSampler, vTextureCoord);", "gl_FragColor = vec4(mix(color, vec4(vec3(color * noise), 0.0), 0.18));", "}"].join("\n"),
        val: 0
    }, t_down = {
        vertexShader: ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "varying vec2 vTextureCoord;", "uniform mat3 projectionMatrix;", "void main() {", "gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);", "vTextureCoord = aTextureCoord;", "}"].join("\n"),
        fragmentShader: ["precision highp float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler;", "uniform sampler2D displacementMap;", "uniform sampler2D displacementMap2;", "uniform float time;", "uniform float elapsed;", "uniform float width;", "uniform vec2 resolution;", "uniform float scale;", "float snoise(vec2 co, float seed) {", "return fract(sin(dot(co * seed, vec2(12.9898, 78.233))) * 43758.5453);", "}", "void main() {", "vec2 repeat = vec2(scale, scale * resolution.y / resolution.x);", "vec2 uv = gl_FragCoord.xy / vec2(resolution.x, resolution.y);", "vec2 vCoord = fract(uv.xy * repeat.xy);", "vec4 displacement1 = texture2D( displacementMap, vCoord);", "vec4 displacement2 = texture2D( displacementMap2, vCoord);", "vec4 displacement = mix(displacement1, displacement2, vec4(time));", "vec2 mixTexture = mix(displacement.xy, vTextureCoord.xy, vec2(time));", "vec2 testPos1 = mixTexture + (1.0 - time) * displacement.xy * 0.5;", "vec2 testPos = mix(testPos1, vec2(1.0), vec2(1.0 - time));", "vec2 distUv = vec2(vTextureCoord.x, testPos.y);", "float noise = snoise(distUv, elapsed);", "vec4 color = texture2D(uSampler, distUv);", "gl_FragColor = vec4(mix(color, vec4(vec3(color * noise), 0.0), 0.18));", "}"].join("\n"),
        simpleFragmentShader: ["precision highp float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler;", "uniform sampler2D displacementMap;", "uniform sampler2D displacementMap2;", "uniform float time;", "uniform float elapsed;", "uniform float width;", "uniform vec2 resolution;", "uniform float scale;", "float snoise(vec2 co, float seed) {", "return fract(sin(dot(co * seed, vec2(12.9898, 78.233))) * 43758.5453);", "}", "void main() {", "vec2 repeat = vec2(scale, scale * resolution.y / resolution.x);", "vec2 uv = gl_FragCoord.xy / vec2(resolution.x, resolution.y);", "float noise = snoise(vTextureCoord, elapsed);", "vec4 color = texture2D(uSampler, vTextureCoord);", "gl_FragColor = vec4(mix(color, vec4(vec3(color * noise), 0.0), 0.18));", "}"].join("\n"),
        val: 0
    }, t_up = {
        vertexShader: ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "varying vec2 vTextureCoord;", "uniform mat3 projectionMatrix;", "void main() {", "gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);", "vTextureCoord = aTextureCoord;", "}"].join("\n"),
        fragmentShader: ["precision highp float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler;", "uniform sampler2D displacementMap;", "uniform sampler2D displacementMap2;", "uniform float time;", "uniform float elapsed;", "uniform float width;", "uniform vec2 resolution;", "uniform float scale;", "float snoise(vec2 co, float seed) {", "return fract(sin(dot(co * seed, vec2(12.9898, 78.233))) * 43758.5453);", "}", "void main() {", "vec2 repeat = vec2(scale, scale * resolution.y / resolution.x);", "vec2 uv = gl_FragCoord.xy / vec2(resolution.x, resolution.y);", "vec2 vCoord = fract(uv.xy * repeat.xy);", "vec4 displacement1 = texture2D( displacementMap, vCoord);", "vec4 displacement2 = texture2D( displacementMap2, vCoord);", "vec4 displacement = mix(displacement1, displacement2, vec4(time));", "vec2 mixTexture = mix(displacement.xy, vTextureCoord.xy, vec2(time));", "vec2 testPos1 = mixTexture + (-1.0 + time) * displacement.xy * 0.5;", "vec2 testPos = mix(testPos1, vec2(1.0), vec2(-1.0 + time));", "vec2 distUv = vec2(vTextureCoord.x, testPos.y);", "float noise = snoise(distUv, elapsed);", "vec4 color = texture2D(uSampler, distUv);", "gl_FragColor = vec4(mix(color, vec4(vec3(color * noise), 0.0), 0.18));", "}"].join("\n"),
        simpleFragmentShader: ["precision highp float;", "varying vec2 vTextureCoord;", "uniform sampler2D uSampler;", "uniform sampler2D displacementMap;", "uniform sampler2D displacementMap2;", "uniform float time;", "uniform float elapsed;", "uniform float width;", "uniform vec2 resolution;", "uniform float scale;", "float snoise(vec2 co, float seed) {", "return fract(sin(dot(co * seed, vec2(12.9898, 78.233))) * 43758.5453);", "}", "void main() {", "vec2 repeat = vec2(scale, scale * resolution.y / resolution.x);", "vec2 uv = gl_FragCoord.xy / vec2(resolution.x, resolution.y);", "float noise = snoise(vTextureCoord, elapsed);", "vec4 color = texture2D(uSampler, vTextureCoord);", "gl_FragColor = vec4(mix(color, vec4(vec3(color * noise), 0.0), 0.18));", "}"].join("\n"),
        val: 0
    };
    var PIXIIMG = ['./images/bg1.jpg', './images/bg2.jpg', './images/bg3.jpg', './images/bg4_1.jpg', './images/bg5.jpg'];
    var $page = $('#media .sec');
    var $slogan = $('#slogan .sec');
    var curIndex = -1;
    var total = $page.size();
    var $loadNum = $('#load .num');
    var $loadBar = $('#load .cur');
    pixiLoad();

    /*预加载*/
    function pixiLoad() {
        var ie = ieVersion();
        if (!ie || ie > 9) {
            var imgArray = PIXIIMG;
            imgArray.push('./images/displacement-map2.png');
            imgArray.push('./images/displacement-map3.png');
            PIXI.loader
                .add(PIXIIMG)
                .on("progress", function (loader, resource) {
                    // console.log("loading: " + resource.url);
                    // console.log("progress: " + loader.progress + "%");
                    $loadNum.html(parseInt(loader.progress) + "%");
                    $loadBar.css('width',parseInt(loader.progress) + "%")
                })
                .load(function (target, resource) {
                    // console.log("complete:", target.progress, resource); //加载完成
                    initMain();
                })
        } else {
            isLowIe = true;
            $('body').addClass('low-ie');
            initMain()
        }
    }

    function initMain() {
        $('#load').removeClass('show');
        // $('#main').addClass('show');
        curIndex = 0;
        $page.eq(curIndex).addClass('cur');
        $slogan.eq(curIndex).addClass('cur');
        initStage();


        $(document).mousewheel(function (e, delta) {
            if (isAni) {
                return;
            }
            var index = curIndex;
            var dir = '';
            switch (delta) {
                case -1://down:
                    index += 1;
                    if (index >= total) {
                        index = total;
                        return;
                    }
                    dir = 'down';
                    downAni(index, true);
                    break;
                case 1://up:
                    index -= 1;
                    if (index < 0) {
                        index = 0;
                        return;
                    }
                    dir = 'up';
                    upAni(index, true);
                    break;
            }
            $page.removeClass('prev up down');
            $slogan.removeClass('prev up down');
            $page.eq(curIndex).removeClass('cur up down').addClass('prev ' + dir);
            $page.eq(index).addClass('cur ' + dir);
            $slogan.eq(curIndex).removeClass('cur up down').addClass('prev ' + dir);
            $slogan.eq(index).addClass('cur ' + dir);
            curIndex = index;

            ani();
        });
    }

    function initStage() {
        if (isLowIe) {
            return;
        }
        try {
            renderer = PIXI.autoDetectRenderer(w, h, {
                transparent: !0
            })
        } catch (a) {
            renderer = new PIXI.CanvasRenderer(w, h, {
                transparent: !0
            })
        }
        $('#view').append(renderer.view);
        stage = new PIXI.Container,
            imgCon = new PIXI.DisplayObjectContainer,
            stage.addChild(imgCon);
        var bTemp = new PIXI.Sprite.fromImage(PIXIIMG[0]);
        var b2 = new PIXI.Sprite.fromImage(PIXIIMG[1]);
        var b3 = new PIXI.Sprite.fromImage(PIXIIMG[2]);
        var b4 = new PIXI.Sprite.fromImage(PIXIIMG[3]);
        var b5 = new PIXI.Sprite.fromImage(PIXIIMG[4]);
        mapArr = [],
            mapArr[0] = bTemp,
            mapArr[1] = b2,
            mapArr[2] = b3,
            mapArr[3] = b4,
            mapArr[4] = b5,
            mapCur = mapOld = bTemp,
            imgCon.addChild(mapOld),
            displacementMap = new PIXI.Texture.fromImage("./images/displacement-map3.png"),
            displacementMap2 = new PIXI.Texture.fromImage("./images/displacement-map2.png"),
            c = {
                time: {
                    type: "f",
                    value: 1
                },
                elapsed: {
                    type: "f",
                    value: 1
                },
                scale: {
                    type: "f",
                    value: 1
                },
                displacementMap: {
                    type: "sampler2D",
                    value: displacementMap
                },
                displacementMap2: {
                    type: "sampler2D",
                    value: displacementMap2
                },
                resolution: {
                    type: "v2",
                    value: [w, h]
                }
            };
        n();
    }

    function p(e) {
        if (isLowIe) {
            return;
        }
        mapCur = mapArr[e],
            imgCon.removeChild(mapOld),
            imgCon.addChild(mapCur),
            mapOld = mapCur
    }

    function n() {
        if (isLowIe) {
            return;
        }
        d = t.vertexShader,
            e = t.fragmentShader,
            shader = new PIXI.Filter(d, e, c),
            imgCon.filters = [shader]
    }

    function ani() {
        if (isLowIe) {
            return;
        }
        shader.uniforms.elapsed += .01,
        isAni && (shader.uniforms.time = 1 - t.val),
            renderer.render(stage),
            requestAnimFrame(ani)
    }

    function downAni(e, a) {
        if (isLowIe) {
            return;
        }
        t = t_down,
            n(),
            translate(e, a)
    };

    function upAni(e, a) {
        if (isLowIe) {
            return;
        }
        t = t_up,
            n(),
            translate(e, a)
    }

    /*e:index,a:boolean*/
    function translate(e, a) {
        isAni = !0,
            TweenMax.to(t, 1, {
                val: 1056 >= h ? 1 : .5,
                ease: Quint.easeIn,
                onComplete: function () {
                    t.val = 1,
                        isAni = !0,
                    a && p(e),
                        TweenMax.to(t, .1, {
                            val: 0,
                            delay: .5,
                            ease: Quint.easeOut,
                            onComplete: function () {
                                t.val = 0,
                                    isAni = !1,
                                    $('#media .prev').removeClass('prev up down')
                            }
                        })
                }
            })
    }

    function ieVersion() {
// 判断是否为IE
        var isIE = navigator.userAgent.toLocaleLowerCase().indexOf('msie') !== -1;
        if (isIE) {
// 判断是否为IE6、7、8
            var isLteIE8 = isIE && !+[1,],
                ieVer = 6,

// 用于防止因通过IE8+的文档兼容性模式设置文档模式，导致版本判断失效
                dm = document.documentMode;

            if (dm) {
                switch (dm) {
                    case 6 :
                        ieVer = 6;
                        break;
                    case 7 :
                        ieVer = 7;
                        break;
                    case 8 :
                        ieVer = 8;
                        break;
                    case 9 :
                        ieVer = 9;
                        break;
                    case 10 :
                        ieVer = 10;
                        break;
                    case 11 :
                        ieVer = 11;
                        break;
                }
            } else {
// 判断是否为IE6，IE7开始有XMLHttpRequest对象
                if (isLteIE8 && !XMLHttpRequest) {
                    ieVer = 6;

// 判断是否为IE7，IE8开始有document.documentMode属性
                } else if (isLteIE8 && !document.documentMode) {
                    ieVer = 7;
                }

// 判断是否IE8
                if (isLteIE8 && document.documentMode) {
                    ieVer = 8;
                }

//判断IE9，IE10开始支持严格模式，严格模式中函数内部this为undefined
                if (!isLteIE8 && (function () {
                        "use strict";
                        return !!this;
                    }())) {
                    ieVer = 9;
                }

// 判断IE10，IE11开始移除了attachEvent属性
                if (isIE && !!document.attachEvent && (function () {
                        "use strict";
                        return !this;
                    }())) {
                    ieVer = 10;
                }

                if (isIE && !document.attachEvent) {
                    ieVer = 11;
                }
            }

            return ieVer;
        } else {
            return false;
        }
    }
})

