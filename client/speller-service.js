const spellingKey = 'Spelling-key';

export function getSpellingWords() {
    const spellingJson = localStorage.getItem(spellingKey);
    if (!spellingJson) {
        return [];
    }

   // const spellingJson = atob(spellingBase64);

    try {
        const result = JSON.parse(spellingJson);
        if (result) {
            return result.map(item => ({...item, english: atob(item.english)}));
        }
        return result;
    } catch(e) {
        console.error(`Could not parse json`, spellingJson, e);
        return [];
    }
}

export function setSpellingWords(spellingWords) {
    localStorage.setItem(spellingKey, (JSON.stringify(spellingWords.map(item => ({...item, english: btoa(item.english) })) || {})));
}
