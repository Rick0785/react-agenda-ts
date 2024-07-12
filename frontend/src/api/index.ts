import axios from 'axios';
import { getStoredUser } from '../store/authStorage';

const api = axios.create({
  baseURL: process.env.REACT_APP_CALENDAR_API,
  headers: {
    Accept: 'application/jsoncamelcase',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const user = getStoredUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
