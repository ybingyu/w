/*
 * @Descripttion: 狐妖share
 * @version: 
 * @Author: bindy(128080)
 * @Date: 2021-06-07 16:42:56
 * @LastEditors: bindy(128080)
 * @LastEditTime: 2021-06-15 09:43:40
 */

var app = new Vue({
    el: '#app',
    data: {
        broswer: Public.checkMobile(),
        sharePage: '',// 分享页显示
        prevPop: [],// 前一个弹窗
        curPop: null,// 当前弹窗
        pop: {
            common: false,
        },
        popCommonMsg: '通用',
    },
    methods: {
        shareCreatedHandler() {
            // start
            // TODO:为了展示，解析地址代码(可删掉)
            // 快速设置去哪一页
            var p =Public.GetQueryString('p') || 'share'
            this.sharePage = p
            // end

            // this.showCommonPop('aaa')
        },
        showPop(key, noprev) {
            // noprev true 不需要存当前弹窗(替换弹窗)
            if (!noprev && this.curPop) {// 默认存当前弹窗
                this.prevPop[this.prevPop.length] = this.curPop
                // 当前弹窗关闭
                this.pop[this.curPop] = false
            } else {
                // this.prevPop = null
            }
            this.curPop = key
            this.pop[key] = true
        },
        // 通用弹窗
        showCommonPop(msg) {
            this.popCommonMsg = msg
            // this.pop['common'] = true
            this.showPop('common')
        },
        closeCommonPop() {
            // this.pop['common'] = false
            this.closePop()
        },
        /* 弹窗 */
        closePop(key) {
            key = key || this.curPop
            this.pop[key] = false
            this.curPop = null;
            if (this.prevPop[this.prevPop.length - 1]) {
                // 打开前弹窗
                this.curPop = this.prevPop[this.prevPop.length - 1]
                this.pop[this.curPop] = true
                this.prevPop.length = this.prevPop.length - 1
            }

        },
    },
    created: function () {
        this.shareCreatedHandler()
    },
    computed: {
    }
})
