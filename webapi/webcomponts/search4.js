class SearchBox extends HTMLElement {
    constructor() {
        super();// 调用超类的构造器，必须先调用
        let shadow = this.attachShadow({ mode: 'closed' });
        // let shadow = this.attachShadow({ mode: 'open' });

        SearchBox.template = document.createElement('template');
        SearchBox.template.innerHTML = `
        <style>
        /*  :host伪类，指代自定义元素本身。 */
            :host {
                display:block;
                background-color: #d4d4d4;
                padding:10px
            }
            .ipt{border:1px solid #ddd;padding:5px}
        </style>
        <div class="search">
            <input type="text" class="ipt" placeholder="请输入搜索内容">
        </div>
        `;
        let content = SearchBox.template.content.cloneNode(true);

        // 插入shadow里
        shadow.appendChild(content);

    }


}

// 调用  customElements.define() 将SearchBox 元素注册为<search-box>标签
// 注意，自定义元素的标签名必须包含一个连字符
window.customElements.define('search-box', SearchBox)
