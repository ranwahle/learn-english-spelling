export class Notifier extends HTMLElement {
    connectedSubscribers = [];

    connectedCallback() {
        //    this.render();
        const shadow = this.attachShadow({mode: 'open'});
        const style = document.createElement('style');
        style.textContent = this.styleContent;
        shadow.appendChild(style);
        shadow.appendChild(document.createElement('div'));

        this.connectedSubscribers.forEach(sub => sub());
    }

    _type = '';

    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type;
        const isError = type === 'error';

        if (this.innerDiv) {
            this.setClasses(this.innerDiv, isError);
        } else {
            this.connectedSubscribers.push(() => {
                this.setClasses(this.innerDiv, isError);
            })
        }
    }

    hide() {
        this.innerDiv.classList.add('hidden');
    }

    setClasses(innerDiv, isError) {
        innerDiv.classList.add(isError ? 'error' : 'success');
        innerDiv.classList.remove(!isError ? 'error' : 'success');
    }

    styleContent = `position: static;
 
 .empty-rule {}
 
      .hidden {
        opacity: 0;
        transition: opacity 5s;
    }
    
     div {
        color: white;
        font-size: 2em;
        transition: opacity 5s;
        opacity: 1;
    }
    .error {
        background-color: rgba(152,39,41,1);
    }
    .success {
        background-color: rgba(57,152,72,1);
    }
    `

    get innerDiv() {
        const {shadowRoot} = this;
        const div = !shadowRoot ? null : shadowRoot.querySelector('div');

        return div
    }

    get message() {
        return this.shadowRoot.querySelector('div').textContent;
    }

    set message(message) {

        if (!this.innerDiv) {
            this.connectedSubscribers.push(() => {
                this.innerDiv.textContent = message;
            });

            return;
        }
        this.innerDiv.textContent = message;
    }


}

customElements.define('notification-component', Notifier);
