import axios from 'axios';

axios.defaults.baseURL = process.env.BACKEND_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;
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

class APIClient {
get = (url: string, params: any) => {
    let response;
    // console.log("token =",token);

    let paramKeys: string[] = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      })

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      response = axios.get(`${url}?${queryString}`, {
        ...params,
      });
    } else {
      response = axios.get(`${url}`, {
        ...params,
      });
    }

    return response;
  };
post = (url: string, data: any, config = {}) => {
    return axios.post(url, data, {
        ...config,
    });
};
put = (url: string, data: any) => {
    return axios.put(url, data, {
    });
};
delete = (url: string, data: any) => {
    return axios.delete(url, {

    });
};
}


const apiClient = new APIClient();

export { APIClient, apiClient };