import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
                  {},
                  { withCredentials: true }
              );

              return api(originalRequest);
          } catch (refreshError) {
              window.location.href = '/login';
              return Promise.reject(refreshError);
          }
      }

      return Promise.reject(error);
  }
);

export default api;
