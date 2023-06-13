import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class DiscTrackerAPI {
    static token;

    static async request(endpoint, data = {}, method="get") {
        console.debug(`API Call: ${endpoint}, ${data}, ${method}`);

        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${DiscTrackerAPI.token}`};
        const params = (method === "get") ? data : {};

        try {
            return (await axios({url, method, data, params, headers})).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }
    static async logIn(username, password) {
        let res = await this.request('auth/token', {username, password}, 'post');
        return res;
    }
    static async register(formData) {
        let res = await this.request('auth/register', formData, 'post');
        return res
    }
    static async getUser(username) {
        let res = await this.request(`users/${username}`, {}, 'get');
        return res
    }
    static async editUser(username, formData) {
        try {
            let res = await this.request(`users/${username}`, formData, 'patch');
            return res;
        } catch(err) {
            return err;
        }
    }
    static async getDisc(discId) {
        const res = await this.request(`discs/${discId}`);
        return res;
    }
    static async getCourses(name, limit=5) {
        const res = await this.request(`courses`, {courseName: name, limit: limit}, 'get');
        return res.results;
    }
    static async doCheckIn(discId, formData) {
        await this.request(`checkin/${discId}`, formData, 'post');
    }
}

export default DiscTrackerAPI