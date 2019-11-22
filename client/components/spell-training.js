import {getSpellingWords} from "../speller-service.js";
import {notify} from "../notifications.js";

const trainingAreaID = 'training-area';
const scoreAreaID = 'score-area';
const answerAreaId = 'answer-area';
const amIRightButtonId = 'bntAmIRight';

export class SpellTraining extends HTMLElement {
    words = [];
    score = {right: 0, wrong: 0};

    connectedCallback() {
        this.render();
        this.setEvents();
        this.startTraining();

    }

    setEvents() {
        this.querySelector(`#${amIRightButtonId}`).onclick = () => {
            const textField = this.querySelector(`#${answerAreaId} input`);
            const guess = textField.value;
            if (!guess) {
                return;
            }
            if (guess.toLowerCase().localeCompare(this.tempWord.english.toLowerCase()) === 0) {
                this.score.right++;
                notify({type: 'success', message: 'Yes You are right!'})
                this.words = this.words.filter(word => word !== this.tempWord);
                textField.value = '';
                this.presentWord();
            } else {
                notify({type: 'error', message: 'Hmmm no, try again.'})
                this.score.wrong++;
            }
            const {score} = this;
            this.querySelector(`#${scoreAreaID}`).innerText = `${score.right} / ${score.right + score.wrong}`;
        }
    }

    startTraining() {
        this.words = [...getSpellingWords()];
        this.presentWord();

    }

    presentWord() {

        if (this.words.length === 0) {
            const {score} = this;
            this.querySelector(`#${scoreAreaID}`).innerText = `Final result: ${score.right} / ${score.right + score.wrong}`;

        }
        const trainingArea = this.querySelector(`#${trainingAreaID}`);

        const randomIndex = Math.floor(Math.random() * this.words.length);

        this.tempWord = this.words[randomIndex];



        trainingArea.innerText = this.tempWord ?  `${this.tempWord.hebrew}`: 'ניחשת את כל המילים';


    }

    render() {

        this.innerHTML = `<h1>Training</h1>
    <div id="${trainingAreaID}"></div>
    <div id="${answerAreaId}">
    <input id="answer" type="text" placeholder="Your answer">
    <button id="${amIRightButtonId}">Am I right?</button>
</div>
    <div id="${scoreAreaID}"></div>
`;

    }


}

customElements.define('spell-training', SpellTraining);
