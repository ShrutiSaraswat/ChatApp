import axios from "axios";

const prod = true;

// const baseURL = prod
//   ? "https://chat-app-eight-umber.vercel.app/"
//   : "http://localhost:5000/";

const baseURL = "https://chat-app-eight-umber.vercel.app/";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Add this line to enable sending cookies with requests
});

// console.log("ENV", process.env.ENV);

export default axiosInstance;
