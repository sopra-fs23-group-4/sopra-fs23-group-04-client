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
}
