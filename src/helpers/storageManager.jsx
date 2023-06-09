import { roundLengthInSeconds } from "../components/views/game/Settings";

export const Role = {
    HOST: "host",
    PLAYER: "player",
};

export class StorageManager {
    static clearAll() {
        sessionStorage.clear();
    }

    static initializeUser(user) {
        this.setToken(user.token);
        this.setUserId(user.id);
        this.setUsername(user.username);
        this.setQuote(user.quote);
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

    static setRole(role) {
        sessionStorage.setItem("role", role);
    }
    static getRole() {
        return sessionStorage.getItem("role");
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

    static setRoundLength(roundLength) {
        sessionStorage.setItem("roundLength", roundLengthInSeconds[roundLength]);
    }
    static getRoundLength() {
        return sessionStorage.getItem("roundLength");
    }

    static setRoundAmount(roundAmount) {
        sessionStorage.setItem("roundAmount", roundAmount);
    }
    static getRoundAmount() {
        return sessionStorage.getItem("roundAmount");
    }

    static setRound(round) {
        sessionStorage.setItem("round", round);
    }
    static getRound() {
        return sessionStorage.getItem("round");
    }

    static setGamePin(gamePin) {
        sessionStorage.setItem("gamePin", gamePin);
    }
    static getGamePin() {
        return sessionStorage.getItem("gamePin");
    }

    static setLetter(letter) {
        sessionStorage.setItem("letter", letter);
    }
    static getLetter() {
        return sessionStorage.getItem("letter");
    }

    static setFact(fact) {
        sessionStorage.setItem("fact", fact);
    }
    static getFact() {
        return sessionStorage.getItem("fact");
    }

    static setAnswers(answers) {
        sessionStorage.setItem("answers", JSON.stringify(answers));
    }
    static getAnswers() {
        const answers = sessionStorage.getItem("answers");
        return answers ? JSON.parse(answers) : [];
    }

    static resetGame() {
        sessionStorage.removeItem("categories");
        sessionStorage.removeItem("letter");
        sessionStorage.removeItem("answers");
        sessionStorage.removeItem("round");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("gamePin");
        sessionStorage.removeItem("roundLength");
        sessionStorage.removeItem("roundAmount");
    }
}
