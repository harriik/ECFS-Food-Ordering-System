import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ecfs-food-ordering-system.onrender.com/api', 
});

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
