import axios from "axios";

const BASE_URL = import.meta.env.REACT_APP_BASE_URL || "http://localhost:3001";

class DiscTrackerAPI {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug(`API Call: ${endpoint}, ${data}, ${method}`);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${DiscTrackerAPI.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }
  static async logIn(username, password) {
    let res = await this.request("auth/token", { username, password }, "post");
    return res;
  }
  static async register(formData) {
    let data = { ...formData };
    delete data.password2;
    let res = await this.request("auth/register", data, "post");
    return res;
  }
  static async getUser(username) {
    let res = await this.request(`users/${username}`, {}, "get");
    return res;
  }
  static async editUser(username, formData) {
    let res = await this.request(`users/${username}`, formData, "patch");
    return res;
  }
  static async getDisc(discId) {
    const res = await this.request(`discs/${discId}`);
    return res;
  }
  static async getCourses(name, limit = 5) {
    const res = await this.request(
      `courses`,
      { courseName: name, limit: limit },
      "get"
    );
    return res.results;
  }
  static async doCheckIn(discId, formData) {
    await this.request(`checkin/${discId}`, formData, "post");
  }
  static async getDiscs(page = 1, limit = 10, formData) {
    let query = `discs?page=${page}&limit=${limit}`;
    Object.keys(formData).map(
      d => (query += formData[d] == "" ? "" : `&${d}=${formData[d]}`)
    );
    const res = await this.request(query);
    return res;
  }
  static async getAllDiscs() {
    const res = await this.request(`discs`);
    return res;
  }
  static async getCheckins(discId, limit = 5, page = 1) {
    let queryString = `checkin/${discId}?direction=DESC&limit=${limit}`;
    if (page) {
      queryString += `&page=${page}`;
    }
    const res = await this.request(queryString);
    return res;
  }
  static async resetPassword(username) {
    await this.request(`users/${username}/auth/reset`, {}, "patch");
    return;
  }
  static async getUserCheckins(
    username,
    page = 1,
    limit = 5,
    direction = "DESC"
  ) {
    const res = await this.request(
      `checkin/user/${username}?page=${page}&limit=${limit}&direction=${direction}`
    );
    return res;
  }
  static async editCheckin(id, formData, username) {
    const res = await this.request(
      `checkin/${id}`,
      { username, ...formData },
      "patch"
    );
    return res;
  }
  static async getCheckin(id) {
    const res = await this.request(`checkin/id/${id}`);
    return res;
  }
  static async getUsers(page = null, limit = 9, username = null) {
    let queryString = `users?limit=${limit}`;
    if (page) {
      queryString += `&page=${page}`;
    }
    if (username) queryString += `&nameLike=${username}`;

    const res = await this.request(queryString);
    return res;
  }
  static async getAdminUsers(page = null, limit = 9, username = null) {
    let queryString = `users/admins?limit=${limit}`;
    if (page) {
      queryString += `&page=${page}`;
    }
    if (username) queryString += `&nameLike=${username}`;
    const res = await this.request(queryString);
    return res;
  }
  static async adminEditUser(username, formData) {
    let res = await this.request(`users/${username}/admin`, formData, "patch");
    return res;
  }
  static async getAllCheckins(page = 1, limit = 15, formData = null) {
    const userName = formData?.userName || null;
    const courseName = formData?.courseName || null;
    const date = formData?.date || null;

    let queryString = `checkin?limit=${limit}&page=${page}`;
    if (userName) {
      queryString += `&userName=${userName}`;
    }
    if (date) {
      queryString += `&date=${date}`;
    }
    if (courseName) {
      queryString += `&courseName=${courseName}`;
    }

    const res = await this.request(queryString);
    return res;
  }
  static async adminDeleteUser(username) {
    const res = await this.request(`users/${username}`, {}, "delete");
    return res.message;
  }
  static async deleteCheckIn(id, username) {
    const res = await this.request(`checkin/${id}`, { username }, "delete");
    return res.message;
  }
  static async createDisc(data) {
    const res = await this.request(`discs`, data, "post");
    return res;
  }
  static async getStatsForDisc(discId) {
    const res = await this.request(`checkin/${discId}/stats`, {}, "get");
    return res;
  }
  static async adminCreateNewUser(formData) {
    let data = { ...formData };
    delete data.password2;

    const res = await this.request(`users/new`, data, "post");
    return res;
  }
  static async editDisc(discId, formData) {
    const res = await this.request(`discs/${discId}`, formData, "patch");
    return res;
  }
  static async deleteDisc(discId) {
    const res = await this.request(`discs/${discId}`, {}, "delete");
    return res;
  }
  static async updateUserImg(username, url) {
    const res = await this.request(
      `users/${username}/image`,
      { url: url },
      "patch"
    );
    return res;
  }
  // this will delete the image from cloudinary service
  static async deleteStoredImage(id, username) {
    const res = await this.request(
      `users/${username}/image?id=${id}`,
      {},
      "delete"
    );
    return res;
  }
  // this will modify the db for the user, set image_url to null.
  static async resetUserImage(username) {
    const res = await this.request(
      `users/${username}/image/reset`,
      {},
      "patch"
    );
    return res;
  }
}

export default DiscTrackerAPI;
