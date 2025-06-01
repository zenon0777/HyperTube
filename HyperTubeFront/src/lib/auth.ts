import api from "./axios";

export const authService = {  async register(userData: any) {
    try {
      const response = await api.post("/auth/register/", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Registration failed - please check your information');
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

};
