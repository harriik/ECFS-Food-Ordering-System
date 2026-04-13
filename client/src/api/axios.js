import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ecfs-food-ordering-system.onrender.com/api', // default local port
});

// Add a request interceptor to attach JWT
instance.interceptors.request.use(
  (config) => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userInfo');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.alert("Session timeout. Please login again.");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
