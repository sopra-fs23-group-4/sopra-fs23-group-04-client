import axios from "axios";
import { getDomain } from "helpers/getDomain";
import User from "../models/User";
import { storageManager } from "./storageManager";

export const restApi = axios.create({
    baseURL: getDomain(),
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", Authorization: storageManager.getToken() },
});

export const generalLoginProcedure = (user) => {
    storageManager.initializeUser(user);
};

export class RestApi {
    static async login(username, password) {
        const requestBody = JSON.stringify({ username, password });
        const response = await restApi.post("/login", requestBody);
        const user = new User(response.data);
        user.token = response.headers.authorization;
        generalLoginProcedure(user);
        return user;
    }
    static async registration(username, password) {
        const requestBody = JSON.stringify({ username, password });
        const response = await restApi.post("/users", requestBody);
        const user = new User(response.data);
        user.token = response.headers.authorization;
        generalLoginProcedure(user);
        return user;
    }

    static async getUser() {
        const response = await restApi.get(`/users/${storageManager.getUserId()}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return new User(response.data);
    }

    static async getUsers() {
        const response = await restApi.get(`/users/`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return response.data;
    }

    static async changeUser(user) {
        // how send a user as Body?
        const requestBody = JSON.stringify({ token: user.token, quote: user.quote });
        return await restApi.put(`/users/${storageManager.getUserId()}`, requestBody);
    }

    static async getQuoteCategories() {
        const response = await restApi.get(`/quotes/`);
        return response.data.categories;
    }

    static async generateQuote(category) {
        const response = await restApi.get(`/quotes/${category}`);
        return response.data.quote;
    }

    static async getAllCategories() {
        const response = await restApi.get(`/games/categories`);
        return response.data.categories;
    }

    static async getGameCategories(gamePin) {
        const response = await restApi.get(`/games/${gamePin}/categories`);
        return response.data.categories;
    }

    static async getGameUsers(gamePin) {
        const response = await restApi.get(`/games/${gamePin}/users`);
        return response.data;
    }

    static async createGame(rounds, roundLength, categories) {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: storageManager.getToken(),
        };
        const requestBody = JSON.stringify({ rounds, roundLength, categories });
        const response = await restApi.post("/games/lobbies/creation", requestBody, { headers });
        return response.data;
    }

    static async joinGame(pin) {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: storageManager.getToken(),
        };
        await restApi.put(`/games/lobbies/${pin}/join`, null, { headers });
    }

    static async leaveGame(pin) {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: storageManager.getToken(),
        };
        await restApi.put(`/games/lobbies/${pin}/leave`, null, { headers });
    }

    static async startGame(gamePin) {
        await restApi.post(`/games/${gamePin}/start`);
    }

    static async EndRound(gamePin, round) {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: storageManager.getToken(),
        };
        await restApi.put(`/games/${gamePin}/${round}/end`, { headers });
    }

    static async postAnswers(gamePin, round, answers) {
        const requestBody = JSON.stringify(answers);
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: storageManager.getToken(),
        };
        console.log(requestBody);
        await restApi.post(`/games/${gamePin}/${round}`, requestBody, { headers });
    }

    static async getAnswersForCategory(gamePin, round, category) {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: storageManager.getToken(),
        };
        const response = await restApi.get(`/games/${gamePin}/${round}/${category}`, { headers });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return response.data;
    }

    static async postVotes(gamePin, round, category, votes) {
        const requestBody = JSON.stringify(votes);
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: storageManager.getToken(),
        };
        return await restApi.post(`/games/${gamePin}/${round}/${category}`, requestBody, { headers });
    }

    static async getVotes(gamePin, round, category) {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: storageManager.getToken(),
        };
        return await restApi.post(`/games/${gamePin}/votings/${round}/${category}`, { headers });
    }

    static async getLeaderboard() {
        const response = await restApi.get('/games/lobbies/Leaderboard');
        return response.data;
    }
}
export const handleError = (error) => {
    const response = error.response;

    // catch 4xx and 5xx status codes
    if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
        let info = `\nrequest to: ${response.request.responseURL}`;

        if (response.data.status) {
            info += `\nstatus code: ${response.data.status}`;
            info += `\nerror: ${response.data.error}`;
            info += `\nerror message: ${response.data.message}`;
        } else {
            info += `\nstatus code: ${response.status}`;
            info += `\nerror message:\n${response.data}`;
        }

        console.log("The request was made and answered but was unsuccessful.", error.response);
        return info;
    } else {
        if (error.message.match(/Network Error/)) {
            alert("The server cannot be reached.\nDid you start it?");
        }

        console.log("Something else happened.", error);
        return error.message;
    }
};
