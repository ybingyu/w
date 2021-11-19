class SearchBox extends HTMLElement {
    constructor() {
        super();// 调用超类的构造器，必须先调用



        let container = document.createElement('div')
        container.classList.add('search')

        let ipt = document.createElement('input')
        ipt.classList.add('ipt')
        container.appendChild(ipt)
        this.ipt = ipt


        this.appendChild(container);
    }

    // 浏览器会在一个<search-box>元素被插入文档时 调用这个方法。
    connectedCallback() {
        console.log('connectedCallback')
    }

    // 这个静态的observedAttributes属性用于制定我们 想在那个属性变化时收到通知
    static get observedAttributes() { return ['placeholder', 'width'] }

    // 这个回调会在上面列出的属性变化时被调用，从自定义元素被解析时开始，包括之后的变化
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'placeholder':
                this.placeholder = newValue
                break;
            case 'width':
                this.width = newValue
                break;

            default:
                break;
        }
    }


    //  定义元素的标签属性 对应的Javascript属性
    //  这些获取和设置方法只是获取和设置底层属性
    //  如果设置了Javascript的属性，则修改底层的属性会触发调用 attributeChangedCallback()进而更新元素的样式
    get placeholder() { return this.ipt.getAttribute('placeholder') }
    set placeholder(p) { this.ipt.setAttribute('placeholder', p) }
    get width() { return this.ipt.getAttribute('placeholder') }
    set width(w) { this.ipt.style.width = w }

}

// 调用  customElements.define() 将SearchBox 元素注册为<search-box>标签
// 注意，自定义元素的标签名必须包含一个连字符
window.customElements.define('search-box', SearchBox)
