import { create } from "zustand";
import { CompanyLoginData, CompanyRegisterData } from "../types/companyAuth";
import { companyAuthService } from "../services/companyAuthService";

// Type representing the logged-in company
export interface Company {
  id: string;
  name: string;
  email: string;
  logo?: string;
  createdAt?: string;
}

// Auth state for the store
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

  // Register company and save to localStorage
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

  // Login company and save to localStorage
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

  // Logs out and clears localStorage
  logout() {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyInfo");
    set({
      token: null,
      company: null,
    });
  },

  // Loads auth info from localStorage
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
