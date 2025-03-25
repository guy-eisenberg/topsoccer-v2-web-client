import axios from "axios";

const payme = axios.create({
  baseURL: process.env.PAYME_API_URL,
  params: {
    seller_payme_id: process.env.PAYME_API_KEY,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

export default payme;
