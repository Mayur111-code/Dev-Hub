import axios from "axios";


const API = axios.create({
  baseURL:// "https://dev-hub-16hk.onrender.com/api" ||
   "http://localhost:3000/api",
});


API.interceptors.response.use(
  (res) => {
   
    return res;
  },
  (err) => {
    console.error("API error", err.config && err.config.url, err.response && err.response.status, err.message);
    return Promise.reject(err);
  }
);


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
