export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cvUrl?: string;
}

export interface UserRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cvFile?: File;
}

export interface UserLoginData {
  email: string;
  password: string;
}
