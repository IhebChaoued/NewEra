import axios from "axios";
import { CompanyRegisterData, CompanyLoginData } from "../types/companyAuth";

/**
 * Registers a company via the backend API.
 * Sends multipart/form-data if a logo is provided.
 */
const register = async (data: CompanyRegisterData) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  if (data.logo) {
    formData.append("logo", data.logo);
  }

  await axios.post("/api/company/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Logs in a company via the backend API.
 * Sends JSON body.
 */
const login = async (data: CompanyLoginData) => {
  await axios.post("/api/company/login", data);
};

// ✅ Export a single object
export const companyAuthService = {
  register,
  login,
};
