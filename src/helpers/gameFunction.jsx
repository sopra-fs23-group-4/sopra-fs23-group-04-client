export function createAnswerDictionary(categories, answers) {
    const answerDict = {};
    const answersFinal = answers.map((value) => value ?? "-");
    for (let i = 0; i < categories.length; i++) {
        const key = categories[i];
        answerDict[key] = answersFinal[i];
    }
    return answerDict;
}
