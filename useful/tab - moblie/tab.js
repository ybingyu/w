function Tab(){}
Tab.prototype={
    init:function(opt){
        var _this=this;
        this.tabTitSel = opt.tabTitSel || "#tabTit";
        this.tabMainSel = opt.tabMainSel || "#tabMain";
        this.dom={},
        this.lastOnIndex = 0;
        this.dom.otabTitList = document.querySelectorAll(this.tabTitSel+">li");
        this.dom.otabMainList = document.querySelectorAll(this.tabMainSel+">li");

        // 初始化 data-index
        var len = this.dom.otabTitList.length;
        for (var i = 0; i < len; i++) {
            this.dom.otabTitList[i].dataset.index=i;
            this.dom.otabTitList[i].onclick = function(){
                console.log(this.dataset.index);
                _this.changeTab(parseInt(this.dataset.index));
            }
        };
    },
    changeTab:function(index){
        var _this=this;
        DomControl.removeClass(this.dom.otabTitList[this.lastOnIndex],"on");
        DomControl.addClass(this.dom.otabTitList[index],"on");
        DomControl.addClass(this.dom.otabMainList[this.lastOnIndex],"dn");
        DomControl.removeClass(this.dom.otabMainList[index],"dn");
        
        this.lastOnIndex = index;
    }
};

function DomControl(){}
/**
 * hasClass
 * @prama {object} ele dom元素
 * @prama {string} cls 样式
 */
DomControl.hasClass = function(ele,cls) { 
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')); 
} 
/**
 * addClass
 * @prama {object} ele dom元素
 * @prama {string} cls 样式
 */
DomControl.addClass = function(ele,cls){ 
    if (!this.hasClass(ele,cls)) {
        ele.className += " "+cls; 
    }
} 
/**
 * removeClass
 * @prama {object} ele dom元素
 * @prama {string} cls 样式
 */
DomControl.removeClass = function(ele,cls){
    if (this.hasClass(ele,cls)) { 
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)'); 
        ele.className=ele.className.replace(reg,' '); 
    } 
} 