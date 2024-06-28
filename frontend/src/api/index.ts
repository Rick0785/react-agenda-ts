import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_CALENDAR_API,
  withCredentials: true,
  headers: {
    Accept: 'application/jsoncamelcase',
    'Content-Type': 'application/json',
  },
});

export default api;
