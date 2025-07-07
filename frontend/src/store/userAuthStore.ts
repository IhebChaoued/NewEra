import { create } from "zustand";
import { userAuthService } from "../services/userAuthService";
import { UserLoginData, UserRegisterData, User } from "../types/userAuth";

export interface UserAuthState {
  isLoading: boolean;
  error: string | null;
  user: User | null;
  token: string | null;

  register: (data: UserRegisterData) => Promise<void>;
  login: (data: UserLoginData) => Promise<void>;
  logout: () => void;
  loadStoredAuth: () => void;
}

export const useUserAuthStore = create<UserAuthState>((set) => ({
  isLoading: false,
  error: null,
  user: null,
  token: null,

  async register(data) {
    try {
      set({ isLoading: true, error: null });
      const res = await userAuthService.register(data);

      localStorage.setItem("userToken", res.token);
      localStorage.setItem("userInfo", JSON.stringify(res.user));

      set({
        token: res.token,
        user: res.user,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Unknown error during registration.",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  async login(data) {
    try {
      set({ isLoading: true, error: null });
      const res = await userAuthService.login(data);

      localStorage.setItem("userToken", res.token);
      localStorage.setItem("userInfo", JSON.stringify(res.user));

      set({
        token: res.token,
        user: res.user,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Unknown error during login.",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    set({
      token: null,
      user: null,
    });
  },

  loadStoredAuth() {
    const token = localStorage.getItem("userToken");
    const userInfo = localStorage.getItem("userInfo");

    if (token && userInfo) {
      set({
        token,
        user: JSON.parse(userInfo),
      });
    }
  },
}));
