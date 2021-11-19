class SearchBox extends HTMLElement {
    constructor() {
        super();// 调用超类的构造器，必须先调用

        //  template 在页面上
        let templateElem = document.getElementById('search');
        let content = templateElem.content.cloneNode(true);


        this.appendChild(content);
    }


}

// 调用  customElements.define() 将SearchBox 元素注册为<search-box>标签
// 注意，自定义元素的标签名必须包含一个连字符
window.customElements.define('search-box', SearchBox)
