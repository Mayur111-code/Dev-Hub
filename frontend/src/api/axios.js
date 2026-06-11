import axios from "axios";


const API = axios.create({
  baseURL: "https://dev-hub-16hk.onrender.com/api",
});

// Log requests/responses for debugging like/comment reload issue
API.interceptors.response.use(
  (res) => {
    // optional: console.debug("API response", res.config && res.config.url, res.status);
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
