import axios from "axios";

//Automatically set baseURL and credentials
const instance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
})

export default instance;