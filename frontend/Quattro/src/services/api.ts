import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // tu backend
  withCredentials: false,
});

export default api;
