export default class MessageBox extends HTMLElement {
    constructor(txt) {
        super()
        
        this.box = document.createElement('div')
        this.box.classList.add('message')
        this.box.innerText = txt

        this.appendChild(this.box)
    }
}

customElements.define('message-box', MessageBox)
