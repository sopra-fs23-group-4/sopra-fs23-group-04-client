import axios from "axios";
import { getDomain } from "helpers/getDomain";
import User from "../models/User";
import { StorageManager } from "./storageManager";
import { notifications } from "@mantine/notifications";

export const restApi = axios.create({
    baseURL: getDomain(),
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", Authorization: StorageManager.getToken() },
});

// makes sure, that the header is updated for every request
restApi.interceptors.request.use(
    (config) => {
        config.headers.Authorization = StorageManager.getToken();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const generalLoginProcedure = (user) => {
    StorageManager.initializeUser(user);
};

export class RestApi {
    static async login(username, password) {
        const requestBody = JSON.stringify({ username, password });
        const response = await restApi.post("/login", requestBody);
        if (response.status >= 200 && response.status < 300) {
            const user = new User(response.data);
            user.token = response.headers.authorization;
            generalLoginProcedure(user);
            return user;
        } else if (response.status === 400) {
            throw new Error("This username does not exist");
        } else {
            throw new Error("Something went wrong during the login");
        }
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
        const response = await restApi.get(`/users/${StorageManager.getUserId()}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return new User(response.data);
    }

    static async getUserByUsername(username) {
        const response = await restApi.get(`/users/username/${username}`);
        return response.data;
    }

    static async getAdvancedStatistics(userId) {
        const response = await restApi.get(`/users/${userId}/advancedStatistics`);
        return response.data;
    }

    static async getUsers() {
        const response = await restApi.get(`/users/`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return response.data;
    }

    static async changeUser(user) {
        // how send a user as Body?
        const requestBody = JSON.stringify({ token: user.token, quote: user.quote });
        return await restApi.put(`/users/${StorageManager.getUserId()}`, requestBody);
    }

    static async getQuoteCategories() {
        const response = await restApi.get(`/quotes/`);
        return response.data.categories;
    }

    static async generateQuote(category) {
        const response = await restApi.get(`/quotes/${category}`);
        return response.data.quote;
    }

    static async generateFact() {
        const response = await restApi.get(`/facts`);
        return response.data.fact;
    }

    static async getAllCategories() {
        const response = await restApi.get(`/games/categories`);
        return response.data.categories;
    }

    static async getGameCategories(gamePin) {
        const response = await restApi.get(`/games/${gamePin}/categories`);
        return response.data.categories;
    }

    static async getGameSettings(gamePin) {
        const response = await restApi.get(`/games/${gamePin}/settings`);
        return response.data;
    }

    static async getGameUsers(gamePin) {
        const response = await restApi.get(`/games/${gamePin}/users`);
        return response.data;
    }

    static async createGame(rounds, roundLength, categories) {
        const requestBody = JSON.stringify({ rounds, roundLength, categories });
        const response = await restApi.post("/games/lobbies/creation", requestBody);
        return response.data;
    }

    static async joinGame(pin) {
        await restApi.put(`/games/lobbies/${pin}/join`, null);
    }

    static async leaveGame(pin) {
        await restApi.put(`/games/lobbies/${pin}/leave`, null);
        StorageManager.resetGame();
    }

    static async startGame(gamePin) {
        await restApi.post(`/games/${gamePin}/start`);
    }

    static async startRound(gamePin, round) {
        await restApi.put(`/games/${gamePin}/${round}/start`);
    }

    static async EndRound(gamePin, round) {
        await restApi.put(`/games/${gamePin}/${round}/end`, {});
    }

    static async postAnswers(gamePin, round, answers) {
        const requestBody = JSON.stringify(answers);
        console.log(requestBody);
        await restApi.post(`/games/${gamePin}/${round}`, requestBody);
    }

    static async getAnswersForCategory(gamePin, round, category) {
        const response = await restApi.get(`/games/${gamePin}/${round}/${category}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return response.data;
    }

    static async postVotes(gamePin, round, category, votes) {
        const requestBody = JSON.stringify(votes);
        return await restApi.post(`/games/${gamePin}/votings/${category}`, requestBody);
    }

    static async getVotes(gamePin, round, category) {
        return await restApi.get(`/games/${gamePin}/votings/${round}/${category}`, {});
    }

    static async skip(gamePin) {
        return await restApi.put(`/games/${gamePin}/skip`, {});
    }

    static async getLeaderboard() {
        const response = await restApi.get("/games/lobbies/leaderboard");
        return response.data;
    }

    static async getScores(gamePin) {
        const response = await restApi.get(`/games/lobbies/${gamePin}/scoreboard`);
        return response.data;
    }

    static async getWinners(gamePin) {
        const response = await restApi.get(`/games/lobbies/${gamePin}/winner`);
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
            notifications.show({ message: response.data.message + ".", color: "red", position: "top-center", autoClose: 4000 });
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
