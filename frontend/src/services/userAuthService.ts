import axios from "axios";
import { UserRegisterData, UserLoginData, User } from "../types/userAuth";

const API_URL = "http://localhost:5000/api/users";

export const userAuthService = {
  async register(
    data: UserRegisterData
  ): Promise<{ token: string; user: User }> {
    const res = await axios.post<{ token: string; user: User }>(
      `${API_URL}/register`,
      data
    );
    return res.data;
  },

  async login(data: UserLoginData): Promise<{ token: string; user: User }> {
    const res = await axios.post<{ token: string; user: User }>(
      `${API_URL}/login`,
      data
    );
    return res.data;
  },

  async getProfile(token: string): Promise<User> {
    const res = await axios.get<User>(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};
