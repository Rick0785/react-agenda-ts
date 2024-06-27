import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', //process.env.REACT_CALENDAR_API,
  withCredentials: true,
  headers: {
    Accept: 'application/jsoncamelcase',
    'Content-Type': 'application/json',
  },
});

export default api;
