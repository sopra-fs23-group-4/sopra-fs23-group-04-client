export function createAnswerDictionary(categories, answers) {
    const answerDict = {};
    for (let i = 0; i < categories.length; i++) {
        const key = categories[i];
        answerDict[key] = answers[i];
    }
    return answerDict;
}
