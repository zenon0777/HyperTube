import api from "./axios";

export const authService = {
  async register(userData: any) {
    try {
      const response = await api.post("/auth/register/", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error;
      }
      throw new Error('Failed to register');
    }
  },
  async login(credentials: any) {
    try {
      const response = await api.post("/auth/login/", credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Username or password incorrect');
      }
      if (error.response?.data) {
        throw error;
      }
      throw new Error('Failed to login');
    }
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
  async changePassword(passwordData: { old_password: string; new_password: string }) {
    const response = await api.post("/auth/change-password/", passwordData);
    return response.data;
  },

  async deleteAccount(userId: string) {
    const response = await api.delete(`/users/${userId}/`);
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

  async logout() {
    try {
      const response = await api.post("/auth/logout/");
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },

  // OAuth login method
  initiateOAuth(provider: string) {
    if (typeof window !== 'undefined') {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/`;
    }
  },

};
