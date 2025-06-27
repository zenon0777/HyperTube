import api from "./axios";

interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: File;
  [key: string]: unknown;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface UpdateProfileData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: File;
  [key: string]: unknown;
}

export const authService = {
  async register(userData: RegisterUserData) {
    try {
			const formData = new FormData();
			formData.append("username", userData.username);
			formData.append("email", userData.email);
			formData.append("password", userData.password);
			formData.append("password2", userData.password2);
			if (userData.first_name) {
				formData.append("first_name", userData.first_name);
			}
			if (userData.last_name) {
				formData.append("last_name", userData.last_name);
			}
			if (userData.profile_picture) {
				formData.append("profile_picture", userData.profile_picture);
			}	

      const response = await api.post("/auth/register/", formData
		);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        throw error;
      }
      throw new Error('Failed to register');
    }
  },
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post("/auth/login/", credentials);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const errorWithResponse = error as { response: { status?: number; data?: unknown } };
        if (errorWithResponse.response?.status === 401) {
          throw new Error('Username or password incorrect');
        }
        if (errorWithResponse.response?.data) {
          throw error;
        }
      }
      throw new Error('Failed to login');
    }
  },
  async getUserProfile() {
    const response = await api.get("/auth/me/");
    return response.data;
  },

  async getUserById(userId: string) {
    const response = await api.get(`/users/${userId}/`);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post("/password/reset/", { email });
    return response.data;
  },

  async updateProfile(userId: string, data: UpdateProfileData | FormData) {
    const config = data instanceof FormData 
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
    const response = await api.patch(`/users/${userId}/`, data, config);
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
