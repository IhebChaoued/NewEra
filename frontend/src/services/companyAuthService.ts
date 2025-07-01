import axios from "axios";

// Define shape of request payloads
export interface CompanyRegisterData {
  name: string;
  email: string;
  password: string;
  logo?: File;
}

export interface CompanyLoginData {
  email: string;
  password: string;
}

// Register a new company
export async function registerCompany(data: CompanyRegisterData) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (data.logo) {
    formData.append("logo", data.logo);
  }

  const response = await axios.post(
    "http://localhost:5000/api/company/register",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

// Log in a company
export async function loginCompany(data: CompanyLoginData) {
  const response = await axios.post(
    "http://localhost:5000/api/company/login",
    data
  );

  return response.data;
}
