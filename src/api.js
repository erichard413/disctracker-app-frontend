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
    static async getAllDiscs() {
        const res = await this.request(`discs`);
        return res
    }
    static async getCheckins(discId, limit=5, page=1) {
        let queryString = `checkin/${discId}?direction=DESC&limit=${limit}`
        if (page) {queryString+= `&page=${page}`}
        const res = await this.request(queryString);
        return res;
    }
    static async resetPassword(username) {
        try {
            await this.request(`users/${username}/auth/reset`, {}, 'patch');
            return;
        } catch (err) {
            console.error(err);
        } 
    }
    static async getUserCheckins(username) {
        try {
            const res = await this.request(`checkin/user/${username}`);
            return res;
        } catch (err) {
            console.error(err);
        }
    }
    static async editCheckin(id, formData) {
        try {
            const res = await this.request(`checkin/${id}`, formData, 'patch');
            return res;
        } catch (err) {
            console.error(err);
        }
    }
    static async getCheckin(id) {
        try {
            const res = await this.request(`checkin/id/${id}`);
            return res;
        } catch (err) {
            console.error(err);
        }
    }
    static async getUsers(page=null, limit=15, username) {
        let queryString = `users?limit=${limit}`
        if (page) {queryString += `&page=${page}`}
        if (username) queryString += `&nameLike=${username}`;
        try {
            const res = await this.request(queryString);
            return res 
        } catch (err) {
            console.error(err);
        }
    }
    static async adminEditUser(username, formData) {
        try {
            let res = await this.request(`users/${username}/admin`, formData, 'patch');
            return res;
        } catch(err) {
            return err;
        }
    }
    static async getAllCheckins(page=null, limit=15) {
        let queryString = `checkin?limit=${limit}`
        if (page) {queryString+= `&page=${page}`}
        try {
            const res = await this.request(queryString);
            return res
        } catch (err) {
            console.error(err);
        }
    }
    static async adminDeleteUser(username) {
        try {
            const res = await this.request(`users/${username}`, {}, 'delete');
            return res.message
        } catch (err) {
            return err.error.message
        }
    }
    static async deleteCheckIn(id) {
        try {
            const res = await this.request(`checkin/${id}`, {}, 'delete');
            return res.message;
        } catch (err) {
            return err.error.message;
        }
    }
    static async createDisc(data) {
        try {
            const res = await this.request(`discs`, data, 'post');
            return res;
        } catch(err) {
            return err;
        }
    }
    static async getDistanceForDisc(discId) {
        try {
            const res = await this.request(`checkin/distance/${discId}`, {}, 'get');
            return res.distance;
        } catch (err) {
            return err;
        }
    }
}

export default DiscTrackerAPI