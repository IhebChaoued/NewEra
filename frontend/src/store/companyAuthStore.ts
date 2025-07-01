import { create } from "zustand";
import { CompanyLoginData, CompanyRegisterData } from "../types/companyAuth";
import { companyAuthService } from "../services/companyAuthService";

// Represents a logged-in company
export interface Company {
  id: string;
  name: string;
  email: string;
  logo?: string;
  createdAt?: string;
}

// State shape for auth store
export interface CompanyAuthState {
  isLoading: boolean;
  error: string | null;
  company: Company | null;
  token: string | null;

  register: (data: CompanyRegisterData) => Promise<void>;
  login: (data: CompanyLoginData) => Promise<void>;
  logout: () => void;
  loadStoredAuth: () => void;
}

export const useCompanyAuthStore = create<CompanyAuthState>((set) => ({
  isLoading: false,
  error: null,
  company: null,
  token: null,

  // Registers a company and saves token + company info
  async register(data) {
    try {
      set({ isLoading: true, error: null });
      const res = await companyAuthService.register(data);

      localStorage.setItem("companyToken", res.token);
      localStorage.setItem("companyInfo", JSON.stringify(res.company));

      set({
        token: res.token,
        company: res.company,
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

  // Logs in a company and saves token + company info
  async login(data) {
    try {
      set({ isLoading: true, error: null });
      const res = await companyAuthService.login(data);

      localStorage.setItem("companyToken", res.token);
      localStorage.setItem("companyInfo", JSON.stringify(res.company));

      set({
        token: res.token,
        company: res.company,
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

  // Logs out and clears storage
  logout() {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyInfo");
    set({
      token: null,
      company: null,
    });
  },

  // Loads auth info from localStorage on app startup
  loadStoredAuth() {
    const token = localStorage.getItem("companyToken");
    const companyInfo = localStorage.getItem("companyInfo");

    if (token && companyInfo) {
      set({
        token,
        company: JSON.parse(companyInfo),
      });
    }
  },
}));
