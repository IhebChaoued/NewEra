import { create } from "zustand";
import { CompanyLoginData, CompanyRegisterData } from "../types/companyAuth";
import { companyAuthService } from "../services/companyAuthService";

/**
 * Defines the shape of the auth store's state and methods.
 */
export interface CompanyAuthState {
  isLoading: boolean;
  error: string | null;

  register: (data: CompanyRegisterData) => Promise<void>;
  login: (data: CompanyLoginData) => Promise<void>;
}

/**
 * Zustand store for managing company authentication state.
 */
export const useCompanyAuthStore = create<CompanyAuthState>((set) => ({
  isLoading: false,
  error: null,

  /**
   * Registers a new company via API.
   */
  async register(data) {
    try {
      set({ isLoading: true, error: null });
      await companyAuthService.register(data);
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

  /**
   * Logs in a company via API.
   */
  async login(data) {
    try {
      set({ isLoading: true, error: null });
      await companyAuthService.login(data);
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
}));
