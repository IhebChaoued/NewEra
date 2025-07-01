import { create } from "zustand";

// Define the type describing a Company returned from backend
export interface Company {
  id: string;
  name: string;
  email: string;
  logo?: string;
  createdAt?: string;
}

// Define the store shape
interface CompanyAuthState {
  token: string | null;
  company: Company | null;
  login: (token: string, company: Company) => void;
  logout: () => void;
}

// Zustand store for company authentication
export const useCompanyAuthStore = create<CompanyAuthState>((set) => ({
  token: null,
  company: null,
  login: (token, company) => set({ token, company }),
  logout: () => set({ token: null, company: null }),
}));
