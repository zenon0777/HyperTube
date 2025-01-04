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


  async updateProfile(userId: string, data: any) {
    const response = await api.patch(`/users/${userId}/`, data);
    return response.data;
  },

  async requestPasswordReset(email: string) {
    const response = await api.post("/password/reset/", { email });
    return response.data;
  },

  async resetPassword(token: string, password: string, password2: string, user: string) {
    console.log({ token, password, password2 });
    const response = await api.post("/password/reset/confirm/", {
      token,
      password,
      password2,
      user,
    });
    return response.data;
  },
  

};
