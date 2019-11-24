import {getSpellingWords, setSpellingWords} from "../speller-service.js";
import {notify} from "../notifications.js";
import './editable-content.js';
const wordsListContainerId = 'words-list';

export class SpellBackoffice extends HTMLElement {
    connectedCallback() {
        this.render();
        this.getWords();
        this.setEvents();
    }

    setEvents() {

        this.querySelector('input[type="file"]').onchange = (evt) => {
            const {files} = evt.target;
            const buttonImport = this.querySelector('#btnImport');
            if (files && files.length) {
                buttonImport.classList.remove('disable');
                buttonImport.removeAttribute('disabled');
            } else {
                buttonImport.classList.add('disable');
                buttonImport.setAttribute('disabled', 'disabled');
            }

        }
        this.querySelector('#btnSave').onclick = () => {
            const words = this.buildWords();
            const newFile = new File([JSON.stringify(words)], 'wordForSpellChecking.json', {
                type: 'application/json'
            });
            saveAs(newFile);
            setSpellingWords(words);
            notify({type: 'success', message: 'Words were saved to a file, look at your download folder'})
        };

        this.querySelector('#btnAdd').onclick = () => {
            this.words = this.words || [];
            const newWord = {
                hebrew: this.querySelector('[name="hebrew-word"]').value,
                english: this.querySelector('[name="english-word"]').value
            }
            this.words.push(newWord);
            setSpellingWords(this.words);
            this.renderWords(this.words);
            notify({tyle: 'success', message: `The word ${newWord.english} has been added`})
        }

        this.querySelector('#btnImport').onclick = () => {
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
                    notify({type: 'success', message: 'Words were imported successfully'})

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

    getEditableComponents(wordIndex) {
        const editableContentEnglish = this.querySelector(`editable-content[data-content="${this.words[wordIndex].english}"`);
        const editableContentHebrew = this.querySelector(`editable-content[data-content="${this.words[wordIndex].hebrew}"`);

        return {editableContentEnglish, editableContentHebrew};

    }

    startEdit(wordIndex) {
        this.setEditState(wordIndex, true);

        this.words[wordIndex].engilshCandidat = this.words[wordIndex].engilsh;
        this.words[wordIndex].hebrewCandidat = this.words[wordIndex].hebrew;



    }

    renderWords(words) {
        if (!words || !words.length) {
            return;
        }
        const wordsHTML = words.map(word => {
            return `<editable-content data-content="${word.english}"></editable-content>
            <editable-content data-content="${word.hebrew}"></editable-content>
                

                <div> <button class="edit-button"> <i class="fas fa-pencil-alt"></i></button>
                <button class="approve-edit hidden"><i class="fas fa-check"></i></button>
                <button class="cancel-edit hidden"><i class="fas fa-times"></i></button>
                </div>`
        }).join('');

        const wordsListContainer = this.querySelector(`#${wordsListContainerId}`);
        wordsListContainer.innerHTML = wordsHTML;

        const editButtonClick = (evt) => {
            const button = evt.target;

            const index = +button.getAttribute('data-index');
            this.startEdit(index);
            button.classList.add('hidden');
            button.parentElement.querySelector('.approve-edit').classList.remove('hidden');
            button.parentElement.querySelector('.cancel-edit').classList.remove('hidden');


        }

        const approveEditClick = (evt) => {
            const button = evt.currentTarget;
            const index = +button.getAttribute('data-index');
            const word = this.words[index];

            this.setEditState(index, false);

            word.hebrew = word.hebrewCandidat;
            word.engilsh = word.englishCandidat;

            delete word.hebrewCandidat;
            delete word.englishCandidat;

            button.classList.add('hidden');
            button.parentElement.querySelector('.edit-button').classList.remove('hidden');
            setSpellingWords(this.words);
        }

        const cancelEditClick = (evt) => {
            const button = evt.currentTarget;
            button.classList.add('hidden');
            const approveEditButton = button.parentElement.querySelector('.approve-edit');
            approveEditButton.classList.add('hidden');
            button.parentElement.querySelector('.edit-button').classList.remove('hidden');
            const index = +approveEditButton.getAttribute('data-index');
            this.setEditState(index, false);

        }

        const editButtons = wordsListContainer.querySelectorAll('.edit-button').forEach((button, index) => {
            button.setAttribute('data-index', index);
            button.onclick = editButtonClick;
        });

        const approveEditButtons = wordsListContainer.querySelectorAll('.approve-edit');
        approveEditButtons.forEach( (button, index) => {
            button.setAttribute('data-index', index);
            button.onclick = approveEditClick;
        })

        const cancelEditButtons = wordsListContainer.querySelectorAll('.cancel-edit');
        cancelEditButtons.forEach( (button, index) => {
            button.setAttribute('data-index', index);
            button.onclick = cancelEditClick;
        })


    }

    setEditState(index, editState) {
        const {editableContentHebrew, editableContentEnglish} = this.getEditableComponents(index);
        editableContentHebrew.editable = editState;
        editableContentEnglish.editable = editState;

        editableContentEnglish.onchange = newValue => this.words[wordIndex].engilshCandidat = newValue;
        editableContentHebrew.onchange = newValue => this.words[wordIndex].hebrewCandidat = newValue;
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
<button id="btnImport" disabled="disabled" class="disable">Import from file</button></div>`
    }
}

customElements.define('spell-backoffice', SpellBackoffice);

