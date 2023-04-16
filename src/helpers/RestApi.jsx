import axios from "axios";
import { getDomain } from "helpers/getDomain";
import User from "../models/User";

export const restApi = axios.create({
    baseURL: getDomain(),
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
});

export const generalLoginProcedure = (user) => {
    sessionStorage.setItem("token", user.token);
    sessionStorage.setItem("user_id", user.id);
};

export class RestApi {
    static async login(username, password) {
        const requestBody = JSON.stringify({ username, password });
        const response = await restApi.post("/login", requestBody);
        const user = new User(response.data);
        generalLoginProcedure(user);
        return user;
    }

    static async registration(username, password) {
        const requestBody = JSON.stringify({ username, password });
        const response = await restApi.post("/users", requestBody);
        const user = new User(response.data);
        generalLoginProcedure(user);
        return user;
    }

    static async logout() {
        await restApi.put(`/logout/${sessionStorage.getItem("user_id")}`);
    }

    static async getUser() {
        const response = await restApi.get(`/users/${sessionStorage.getItem("user_id")}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return response;
    }

    static async getUsers() {
        const response = await restApi.get(`/users/`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return response;
    }

    static async changeUser(user) {
        // how send a user as Body?
        const requestBody = JSON.stringify({ user });
        return await restApi.put(`/users/${sessionStorage.getItem("user_id")}`, requestBody);
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
