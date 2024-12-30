import axios from 'axios';
axios.defaults.baseURL = process.env.BACKEND_URL;

axios.defaults.withCredentials = false;


// const token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null;
// if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// intercepting to capture errors
axios.interceptors.response.use(
  async function (response) {
    return response.data ? response.data : response;
  },
  async function (error) {
    let message;
    const originalRequest = error.config;
    switch (error?.response?.status) {
      case 500:
        message = 'Internal Server Error';
        break;
      case 401:
        message = 'Unauthorized';
        break;
      case 404:
        message = 'Sorry! the data you are looking for could not be found';
        break;
      default:
        message = error?.response?.data?.detail || error;
    }
    return Promise.reject(message);
  }
);

const setAuthorization = (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

class APIClient {
get = (url: string, params: any) => {
    const token = '';
    let response;

    let paramKeys: string[] = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      response = axios.get(`${url}?${queryString}`, {
        ...params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      response = axios.get(`${url}`, {
        ...params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return response;
  };
post = (url: string, data: any, config = {}) => {
    const token = '';
    return axios.post(url, data, {
        ...config,
        headers: {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        },
    });
};
put = (url: string, data: any) => {
    const token = '';
    return axios.put(url, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
delete = (url: string, data: any) => {
    const token = '';
    return axios.delete(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
}

const getJWT = () => {
  const jwt = localStorage.getItem('access_token');
  if (!jwt) {
    return null;
  } else {
    return jwt;
  }
};

const apiClient = new APIClient();

export { APIClient, setAuthorization, getJWT, apiClient };