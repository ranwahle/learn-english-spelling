import {getSpellingWords, setSpellingWords} from "../speller-service.js";
const wordsListContainerId = 'words-list';

export class SpellBackoffice extends HTMLElement {
    connectedCallback() {
        this.render();
        this.getWords();
        this.setEvents();
    }

    setEvents() {
        this.querySelector('#btnSave').onclick = () => {
            const words = this.buildWords();
            const newFile = new File([JSON.stringify(words)], 'wordForSpellChecking.json', {
                type: 'application/json'
            });
           saveAs(newFile);
            setSpellingWords(words);
        };

        this.querySelector('#btnAdd').onclick = () => {
            this.words = this.words || [];
            const newWord = {hebrew: this.querySelector('[name="hebrew-word"]').value,
                english: this.querySelector('[name="english-word"]').value }
            this.words.push(newWord);
            setSpellingWords(this.words);
            this.renderWords(this.words);
        }

        this.querySelector('#btnImport').onclick= () => {
            const fileImport = this.querySelector('input[type="file"]');
            if (!fileImport.files || !fileImport.files.length) {
                return;
            }

            const file = fileImport.files[0];

            const reader = new FileReader();

            reader.onload = () => {
                try {
                    const words = JSON.parse(reader.result);
                    setSpellingWords(words);
                    this.words = words;
                    this.renderWords(words);
                } catch (e) {
                    console.error('Could not read JSON file')
                }
            }

            reader.readAsText(file);

        }
    }

    buildWords() {
        return this.words;
    }

    renderWords(words) {
        if (!words || !words.length) {
            return;
        }
        const wordsHTML = words.map(word => {
            return  `<div>${word.english}</div><div class="hebrew">${word.hebrew}</div>`
        }).join('');

       this.querySelector(`#${wordsListContainerId}`).innerHTML = wordsHTML;

    }

    getWords() {
        const spellingWords = getSpellingWords();
        this.words = spellingWords;
        this.renderWords(spellingWords);


    }

    render() {
        this.innerHTML = `<h1>Backoffice</h1>
<div id="${wordsListContainerId}" class="table">

</div>
        <div>
        <input placeholder="English word" name="english-word">
        <input placeholder="Hebrew word" name="hebrew-word">
        <button id="btnAdd">Add to vocabulary</button>
</div>    
<div><button id="btnSave">Save to file</button></div>

<div>
<input type="file" placeholder="JSON file" accept="application/json">
<button id="btnImport">Import from file</button></div>`
    }
}

customElements.define('spell-backoffice', SpellBackoffice);
