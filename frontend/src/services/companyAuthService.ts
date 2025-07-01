import axios from "axios";
import { CompanyLoginData, CompanyRegisterData } from "../types/companyAuth";
import { Company } from "../store/companyAuthStore";

// API base URL
const API_URL = "http://localhost:5000/api/company";

export const companyAuthService = {
  // Register a company and return token + company info
  async register(
    data: CompanyRegisterData
  ): Promise<{ token: string; company: Company }> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.logo) {
      formData.append("logo", data.logo);
    }

    // ✅ tell axios what shape we expect in response
    const res = await axios.post<{ token: string; company: Company }>(
      `${API_URL}/register`,
      formData
    );

    return res.data;
  },

  // Login and return token + company info
  async login(
    data: CompanyLoginData
  ): Promise<{ token: string; company: Company }> {
    const res = await axios.post<{ token: string; company: Company }>(
      `${API_URL}/login`,
      data
    );

    return res.data;
  },
};
