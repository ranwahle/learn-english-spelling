export class EditableContent extends HTMLElement {
    connectedCallback() {
        this.originalContent = this.content;
        this.render();
    }

    onchange = (newValue) => {};

    static get observedAttributes() {
        return ['data-content', 'data-editable'];
    }

    attributeChangedCallbacl(name, oldValue, newValue) {
        this.render();
    }

    _content = '';

    get editable() {
        return !!this.getAttribute('data-editable');
    }

    set editable(flag) {
        if (flag) {
            this.setAttribute('data-editable', 'true');
        } else {
            this.removeAttribute('data-editable');
        }
        this.render();
    }

    get content() {
        return this.getAttribute('data-content')
    }

    set content(content) {

        this._content = content;
        this.setAttribute('data-content', content);
    }

    setEvents() {
        const inputElement = this.querySelector('input');
        if (!inputElement) {
            return;
        }
        inputElement.onchange = () => {
            this.content = inputElement.value;
            if (this.onchange) {
                this.onchange(this.content);
            }
        }
    }
    render() {
        this.innerHTML = !this.editable ? `<div>${this.content}</div> `
                : `<div><input type="text" value="${this.content}"></div>`;

        this.setEvents();
    }


}

customElements.define('editable-content', EditableContent);
