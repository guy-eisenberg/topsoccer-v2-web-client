import axios from "axios";

export const grow = axios.create({
  baseURL: process.env.GROW_API_URL,
  params: {
    userId: process.env.GROW_USER_ID,
  },
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});
