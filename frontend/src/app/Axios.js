import axios from "axios";

const baseURL = "http://localhost:5000/";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Add this line to enable sending cookies with requests
});

// console.log("ENV", process.env.ENV);

export default axiosInstance;
