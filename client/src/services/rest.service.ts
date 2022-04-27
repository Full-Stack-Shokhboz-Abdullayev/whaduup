import axios, { Axios, AxiosRequestConfig } from "axios";
import { BASE_URL } from "../constants/env-vars";
import router from "../router";
import { useUserStore } from "../store/user.store";
import { LoginBody } from "../types/Login.interface";
import { RegisterBody } from "../types/Register.interface";
import { User } from "../types/User.type";
import { socket } from "./socket.service";

class RestService {
  axios: Axios;

  constructor(config: AxiosRequestConfig) {
    this.axios = axios.create(config);
  }

  private getAuth(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: localStorage.getItem("auth") || "",
      },
    };
  }

  private get userStore() {
    return useUserStore();
  }

  private setAuth(auth: string, user: User) {
    localStorage.setItem("auth", auth);
    this.userStore.setMe(user);
    socket.emit("chat-connected", {
      username: user.username,
    });
  }

  public async login(body: LoginBody) {
    const { data } = await this.axios.post("/login", body);
    this.setAuth(data.auth, data.user);

    return data;
  }

  public async register(body: RegisterBody) {
    const { data } = await this.axios.post("/register", body);
    this.setAuth(data.auth, data.user);

    return data;
  }

  public async refresh() {
    try {
      const { data } = await this.axios.get("/refresh", this.getAuth());

      this.setAuth(data.auth, data.user);
    } catch {
      return router.push({
        name: "auth-login",
      });
    }
  }

  public logout() {
    router.push({
      name: "auth-login",
    });
    localStorage.removeItem("auth");
    this.userStore.default();
  }

  public async users() {
    return (await this.axios.get("/users", this.getAuth())).data;
  }

  public async user(username: string) {
    return (await this.axios.get("/users/" + username, this.getAuth())).data;
  }

  public async messages(to: User) {
    return (
      await this.axios.post(
        "/messages",
        {
          to,
        },
        this.getAuth()
      )
    ).data;
  }
}

export const restler = new RestService({
  baseURL: BASE_URL,
});
