import type { Topsoccer } from "@/types";

export function prepareVerifonePayload({
  price,
  description,
  payment_method,
  merchant_reference,
  success_url,
  cancel_url,
}: {
  price: number;
  description: string;
  payment_method: Topsoccer.PaymentMethod;
  merchant_reference: string;
  success_url: string;
  cancel_url: string;
}) {
  const configurations = (() => {
    switch (payment_method) {
      case "CreditCard":
        return {
          card: {
            payment_contract_id: process.env.VERIFONE_CONTRACT_ID,
            credit_term: "STANDARD",
          },
        };
      case "Apple":
        return {
          apple_pay: {
            dynamic_descriptor: "TOPSOCCER",
            card: {
              sca_compliance_level: "NONE",
              payment_contract_id: process.env.VERIFONE_CONTRACT_ID,
            },
          },
        };
      case "Google":
        return {
          google_pay: {
            dynamic_descriptor: "TOPSOCCER",
            card: {
              sca_compliance_level: "NONE",
              payment_contract_id: process.env.VERIFONE_CONTRACT_ID,
            },
          },
        };
    }
  })();

  return {
    entity_id: process.env.VERIFONE_ENTITY_ID as string,
    currency_code: "ILS",
    amount: price * 100,
    configurations,
    i18n: {
      default_language: "he",
    },
    return_url: success_url,
    shop_url: cancel_url,
    line_items: [
      {
        name: description,
        total_amount: price * 100,
      },
    ],
    merchant_reference,
    redirect_method: "HEADER_REDIRECT",
  };
}
