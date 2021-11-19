class SearchBox extends HTMLElement {
    constructor() {
        super();// 调用超类的构造器，必须先调用

        // 1. template 在页面上
        let templateElem = document.getElementById('search');
        let content = templateElem.content.cloneNode(true);


        // 2. 创建一个<template>元素，用于保存样式表和元素。通过解析HTML字符串初始化模板
        /* SearchBox.template = document.createElement('template');
        SearchBox.template.innerHTML = `
        <style>
            .ipt{border:1px solid #ddd;padding:5px}
        </style>
        <div class="search">
            <input type="text" class="ipt" placeholder="请输入搜索内容">
        </div>
        `;
        // 注意，当实例化一个SearchBox时，我们可以克隆这个模板中的节点，不需要再次解析HTML
        let content = SearchBox.template.content.cloneNode(true); */



        this.appendChild(content);
    }


}

// 调用  customElements.define() 将SearchBox 元素注册为<search-box>标签
// 注意，自定义元素的标签名必须包含一个连字符
window.customElements.define('search-box', SearchBox)
