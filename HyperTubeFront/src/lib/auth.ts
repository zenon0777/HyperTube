import api from "./axios";

export const authService = {
  async register(userData: any) {
    const response = await api.post("/auth/register/", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async login(credentials: any) {
    const response = await api.post("/auth/login/", credentials);
    return response.data;
  },

  async getUserProfile() {
    const response = await api.get("/auth/me/");
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post("/password/reset/", { email });
    return response.data;
  },

  async resetPassword(data: any) {
    const response = await api.post("/password/reset/confirm/", data);
    return response.data;
  },

  async updateProfile(userId: string, data: any) {
    const response = await api.patch(`/users/${userId}/`, data);
    return response.data;
  },
};
