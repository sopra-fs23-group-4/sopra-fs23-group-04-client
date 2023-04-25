export class storageManager {
    static clearAll() {
        sessionStorage.clear();
    }

    static initializeUser(user) {
        this.setToken(user.token);
        this.setUserId(user.id);
        this.setUsername(user.username);
        this.setQuote(user.quote);
        this.setPicture(user.picture);
    }
    static setToken(token) {
        sessionStorage.setItem("token", token);
    }
    static getToken() {
        return sessionStorage.getItem("token");
    }

    static setUserId(userId) {
        sessionStorage.setItem("userId", userId);
    }
    static getUserId() {
        return sessionStorage.getItem("userId");
    }

    static setUsername(username) {
        sessionStorage.setItem("username", username);
    }
    static getUsername() {
        return sessionStorage.getItem("username");
    }

    static setPicture(picture) {
        sessionStorage.setItem("picture", picture);
    }
    static getPicture() {
        return sessionStorage.getItem("picture");
    }

    static setQuote(quote) {
        sessionStorage.setItem("quote", quote);
    }
    static getQuote() {
        return sessionStorage.getItem("quote");
    }

    static setCategoriesSelected(categories) {
        sessionStorage.setItem("categoriesSelected", JSON.stringify(categories));
    }
    static getCategoriesSelected() {
        const categories = sessionStorage.getItem("categoriesSelected");
        return categories ? JSON.parse(categories) : [];
    }

    static removeCategoriesSelected() {
        sessionStorage.removeItem("categoriesSelected");
    }

    static setCategories(categories) {
        sessionStorage.setItem("categories", JSON.stringify(categories));
    }
    static getCategories() {
        const categories = sessionStorage.getItem("categories");
        return categories ? JSON.parse(categories) : [];
    }

    static setLetter(letter) {
        sessionStorage.setItem("letter", letter);
    }
    static getLetter() {
        return sessionStorage.getItem("letter");
    }

    static setAnswers(answers) {
        sessionStorage.setItem("answers", JSON.stringify(answers));
    }
    static getAnswers() {
        const answers = sessionStorage.getItem("answers");
        return answers ? JSON.parse(answers) : [];
    }

    static resetRound() {
        sessionStorage.removeItem("categories");
        sessionStorage.removeItem("letter");
        sessionStorage.removeItem("answers");
    }
}
