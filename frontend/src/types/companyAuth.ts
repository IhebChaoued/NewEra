/**
 * Data for company registration
 */
export interface CompanyRegisterData {
  name: string;
  email: string;
  password: string;
  logo?: File | null;
}

/**
 * Data for company login
 */
export interface CompanyLoginData {
  email: string;
  password: string;
}

/**
 * Response returned from company login endpoint
 */
export interface CompanyLoginResponse {
  token: string;
  company: {
    id: string;
    name: string;
    email: string;
    logo?: string;
    createdAt: string;
  };
}
