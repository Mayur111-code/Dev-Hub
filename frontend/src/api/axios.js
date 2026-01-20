import axios from "axios";


const API = axios.create({
  baseURL:"https://dev-hub-16hk.onrender.com/api"
  //"http://localhost:3000/api"
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
