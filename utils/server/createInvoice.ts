import axios, { AxiosError } from "axios";

const iCount = axios.create({
  baseURL: process.env.ICOUNT_URL,
  params: {
    cid: process.env.ICOUNT_CID,
    user: process.env.ICOUNT_USER,
    pass: process.env.ICOUNT_PASS,
  },
});

export async function createCashInvoice({
  client_name,
  email,
  description,
  price,
}: {
  client_name: string;
  email: string;
  vat_id: string;
  description: string;
  price: number;
}) {
  try {
    const { data } = await iCount.post<{ doc_url: string }>("/doc/create", {
      client_name,
      email,
      doctype: "invrec",
      items: [
        {
          description,
          unitprice_incvat: price.toString(),
          quantity: 1,
        },
      ],
      cash: {
        sum: price.toString(),
      },
      send_email: true,
    });

    return data;
  } catch (e: any) {
    console.error(JSON.stringify((e as AxiosError).toJSON()));

    throw e;
  }
}

export async function createCreditInvoice({
  client_name,
  email,
  description,
  price,
  card_number,
  card_type,
  confirmation_code,
}: {
  client_name: string;
  email: string;
  description: string;
  price: number;
  card_number: string;
  card_type: string;
  confirmation_code: string;
}) {
  try {
    const { data } = await iCount.post<{ doc_url: string }>("/doc/create", {
      client_name,
      email,
      doctype: "invrec",
      items: [
        {
          description,
          unitprice_incvat: price,
          quantity: 1,
        },
      ],
      cc: {
        sum: price,
        card_number,
        card_type,
        confirmation_code,
      },
      send_email: true,
    });

    return data;
  } catch (e: any) {
    console.error(JSON.stringify((e as AxiosError).toJSON()));

    throw e;
  }
}

export async function createRefundInvoice({
  client_name,
  email,
  description,
  price,
  card_number,
  card_type,
  confirmation_code,
}: {
  client_name: string;
  email: string;
  description: string;
  price: number;
  card_number: string;
  card_type: string;
  confirmation_code: string;
}) {
  try {
    const { data } = await iCount.post<{ doc_url: string }>("/doc/create", {
      client_name,
      email,
      doctype: "refund",
      items: [
        {
          description,
          unitprice_incvat: price,
          quantity: 1,
        },
      ],
      cc: {
        sum: price,
        card_number,
        card_type,
        confirmation_code,
      },
      send_email: true,
    });

    return data;
  } catch (e) {
    console.error(JSON.stringify((e as AxiosError).toJSON()));

    throw e;
  }
}
