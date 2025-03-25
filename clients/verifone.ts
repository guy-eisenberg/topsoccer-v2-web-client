import axios from "axios";

export const verifone = axios.create({
  baseURL: process.env.VERIFONE_HOST,
  auth: {
    username: process.env.VERIFONE_USER_ID as string,
    password: process.env.VERIFONE_API_KEY as string,
  },
});
