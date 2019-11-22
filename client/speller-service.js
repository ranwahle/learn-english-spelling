const spellingKey = 'Spelling-key';

const uniqueBy = (array, expression)  => {
    const result = [];

    array.forEach(item => {
        if (!result.find(existing =>  expression(existing, item))) {
            result.push(item);
        }
    });

    return result;
};

export function getSpellingWords() {
    const spellingJson = localStorage.getItem(spellingKey);
    if (!spellingJson) {
        return [];
    }

   // const spellingJson = atob(spellingBase64);

    try {
        let result = JSON.parse(spellingJson);
        if (result) {
            result = uniqueBy(result, (item, existing) => item.hebrew === existing.hebrew);
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
