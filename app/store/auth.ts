import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axios } from "@/app/requests";
import { showToast } from "../components/ui-lib";

export interface AuthStore {
  token: string;
  userInfo: Partial<User>;
  isLogin: boolean;
  login: (username: string, password: string) => Promise<void>;
  initToken: (token?: string) => void;
  logout: () => void;
  register: (
    username: string,
    password: string,
    email?: string,
    phone?: string,
  ) => Promise<void>;
}

export const AUTH_KEY = "chat-auth";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: "",
      isLogin: false,
      userInfo: {},
      async login(username, password) {
        return new Promise(async (resolve, reject) => {
          try {
            const response = (await axios.post(
              "/api/auth",
              { username, password },
              {
                headers: { "Content-Type": "application/json" },
              },
            )) as {
              error: boolean;
              msg?: string;
              userInfo?: Partial<User>;
              token?: string;
            };
            if (!response.error) {
              get().initToken(response.token);
              set(() => ({
                token: response.token,
                userInfo: response.userInfo,
                isLogin: true,
              }));
              showToast("Login successfully");
              resolve();
              return;
            }
            reject();
          } catch (error) {
            console.error("[Fetch Upstream Commit Id]", error);
            reject();
          }
        });
      },
      async initToken(token: string = "") {
        const _token = token || get().token;
        if (!_token) return;
        axios.defaults.headers.common["Authorization"] = `Bearer ${_token}`;
      },
      async logout(initiative = false) {
        if (initiative) {
          showToast("Log out successfully");
        } else {
          showToast("The session has expired, please log in again");
        }
        set(() => ({
          token: "",
          userInfo: {},
          isLogin: false,
        }));
      },
      async register(username, password, email, phone) {
        return new Promise(async (resolve, reject) => {
          try {
            const response = (await axios.post(
              "/api/user",
              { username, password, email, phone },
              {
                headers: { "Content-Type": "application/json" },
              },
            )) as {
              error: boolean;
              msg?: string;
              id?: string;
            };
            if (!response.error) {
              showToast("Register successfully"); // TODO: I18n
              resolve();
              return;
            }
            reject();
          } catch (error) {
            console.error("[Fetch Upstream Commit Id]", error);
            reject();
          }
        });
      },
    }),
    {
      name: AUTH_KEY,
      version: 1,
    },
  ),
);
