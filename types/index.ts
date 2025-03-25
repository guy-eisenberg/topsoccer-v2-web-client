/* eslint-disable @typescript-eslint/no-namespace */
export namespace Topsoccer {
  export interface PaymePaymentData {
    status_code: 0 | 1;
    status_error_code: number;
    status_error_details: string;
    notify_type:
      | "sale-complete"
      | "sale-authorized"
      | "refund"
      | "sale-failure"
      | "sale-chargeback"
      | "sale-chargeback-refund";
    sale_created: number;
    transaction_id: string;
    payme_sale_id: string;
    payme_sale_code: string;
    payme_transaction_id: string;
    price: number;
    currency: string;
    sale_status:
      | "initial"
      | "completed"
      | "refunded"
      | "partial-refund"
      | "authorized"
      | "voided"
      | "partial-void"
      | "failed"
      | "chargeback";
    payme_transaction_card_brand: string;
    payme_transaction_auth_number: string;
    buyer_card_mask: string;
    buyer_card_exp: string;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    buyer_social_id: string;
    buyer_key: string;
    installments: number;
    sale_paid_date: string;
    sale_release_date: string;
    is_token_sale: boolean;
    sale_invoice_url: string;
  }

  export interface GrowPaymentData {
    err: string;
    status: string;
    data: {
      transactionId: number;
      transactionToken: string;
      transactionTypeId: string;
      paymentType: string;
      sum: number;
      firstPaymentSum: number;
      periodicalPaymentSum: number;
      paymentsNum: number;
      allPaymentsNum: number;
      paymentDate: string;
      asmachta: string;
      description: string;
      fullName: string;
      payerPhone: string;
      payerEmail: string;
      cardSuffix: string;
      cardType: string;
      cardTypeCode: number;
      cardBrand: string;
      cardBrandCode: number;
      cardExp: string;
      processId: number;
      processToken: string;
    };
  }

  export interface VerifonePaymentData {
    objectType: "TransactionEvent";
    eventId: string;
    eventDateTime: string;
    recordId: string;
    itemId: string;
    entityUid: string;
    source: string;
    eventType: "TxnSaleApproved";
    content: {
      id: string;
      currency_code: string;
      created_at: string;
      customer_ip: string;
      payment_product: string;
      payment_product_type: string;
      transaction_type: string;
      transaction_status: string;
      reason_code: string;
      arn: string;
      authorization_code: string;
      cvv_present: true;
      rrn: string;
      card_brand: string;
      masked_card_number: string;
      merchant_id: string;
      merchant_reference: string;
      shopper_interaction: string;
      stan: string;
      amount: string;
      payment_summary: object;
    };
  }

  export type PaymentMethod =
    | "CreditCard"
    | "Bit"
    | "Google"
    | "Apple"
    | "Cash"
    | "Manual"
    | "Team"
    | "Wallet";

  export type PaymentStatus = "Completed" | "Waiting" | "Canceled";

  export namespace Ticket {
    export type Object = {
      id: string;
      title: string;
      amount: number;
      price: number;
    };

    export type Payment = {
      id: string;
      created_at: string;
      user_id: string;
      amount: number;
      title: string;
      price: number;
      method: Omit<PaymentMethod, "Cash" | "Manual" | "Team" | "Wallet">;
      status: PaymentStatus;
      invoice_url: string | null;
      grow: GrowPaymentData | null;
      verifone: VerifonePaymentData | null;
    };
  }

  export namespace Alert {
    export interface FullAlert {
      id: string;
      created_at: string;
      content: string;
    }
  }

  export namespace User {
    export type Role = "admin" | "worker" | "user";
    export type Provider = "google" | "email";

    export interface Auth {
      id: string;
      created_at: string;
      display_name: string;
      email: string;
      photo_url: string | null;
      phone_number: string | null;
      tz_id: string | null;
      city: string | null;
      birth_date: string | null;
      role: Role;
      can_pay_cash: boolean;
      blocked: boolean;
      provider: Provider;
      wallet: number;
    }

    export interface InsuranceStatement {
      heart_problems: boolean;
      exercise_difficulty: boolean;
      lung_problems: boolean;
      diabetes: boolean;
      epilepsy: boolean;
      other_issues: boolean;
      full_name: string;
      tz_id: string;
      signed_on: string;
    }

    export interface UserPrivateData {
      id: string;
      birth_date: string | null;
      city: string | null;
      phone_number: string | null;
      tz_id: string | null;
      insurance_statement: InsuranceStatement | null;
    }

    export interface UserReadonlyData {
      id: string;
      role: Role;
      can_pay_cash: boolean;
      blocked: boolean;
      provider: Provider;
      wallet: number;
    }

    export interface UserInterface {
      id: string;
      display_name: string;
      created_at: string;
      email: string;
      photo_url: string | null;
    }
  }

  export namespace Event {
    export type Type =
      | "4X4"
      | "5X5"
      | "6X6"
      | "7X7"
      | "8X8"
      | "9X9"
      | "10X10"
      | "11X11";

    export type SubType = "Singles" | "Teams";

    export type Map = {
      event_id: string;
      user_id: string;
      name: string;
      image: string | null;
      group: Group.Name | null;
      x: number;
      y: number;
      is_mvp: boolean;
    };

    export type WinningTeam = {
      title: string;
      image: string;
    };

    export type BestPlayer = {
      user_id: string;
      title?: string;
      image?: string;
    };

    export interface Object {
      id: string;
      stadium_id: string | null;
      address: string;
      canceled: boolean;
      city: string;
      comment: string | null;
      description: string | null;
      images: string[];
      videos: { url: string; description?: string }[];
      best_move: string | null;
      full: boolean;
      price: number;
      max_players: number | null;
      time: string;
      title: string;
      type: Type;
      sub_type: SubType;
      waze_url: string | null;
      whatsapp_url: string | null;
      reveal_groups: boolean;
      fb_uid: string | null;
      winning_team: WinningTeam | null;
      winning_team_2: WinningTeam | null;
      best_player: BestPlayer | null;
      best_player_2: BestPlayer | null;
    }

    export interface Payment {
      id: string;
      event_id: string;
      user_id: string;
      method: PaymentMethod;
      status: PaymentStatus;
      invoice_url: string | null;
      payme: PaymePaymentData | null;
      grow: GrowPaymentData | null;
      verifone: VerifonePaymentData | null;
    }

    export interface OTPayment {
      id: string;
      created_at: string;
      event_id: string;
      refunded: boolean;
      method: Omit<PaymentMethod, "Cash" | "Manual" | "Team" | "Wallet">;
      status: PaymentStatus;
      full_name: string;
      phone: string;
      email: string;
      invoice_url: string | null;
      grow: GrowPaymentData | null;
      verifone: VerifonePaymentData | null;
      page_shown: boolean;
    }

    export interface Stats {
      goals: number;
      penalty_saved: number;
      is_goalkeeper: boolean;
      clean_net: number;
    }
  }

  export namespace Stadium {
    export interface FullStadium {
      id: string;
      name: string;
      city: string;
      address: string;
      types: Event.Type[];
      images: string[];
      main_image: string | null;
      waze_url: string | null;
      whatsapp_url: string | null;
      description: string | null;
      days: boolean[];
      fb_uid: string | null;
    }
  }

  export namespace Group {
    export type Name =
      | "Orange"
      | "Green"
      | "Yellow"
      | "Pink"
      | "Red"
      | "Blue"
      | "White"
      | "Black";

    export interface FullGroup {
      id: string;
      name: Name;
      wins: number;
    }
  }

  export namespace Game {
    export interface GameCreateData {
      id?: string;
      teamA: {
        team: Team.FullTeam;
        score?: number;
      };
      teamB: {
        team: Team.FullTeam;
        score?: number;
      };
    }

    export interface FullGame {
      id: string;
      event_id: string;
      level_id: string;
      team_a_id: string;
      team_a_score: number;
      team_b_id: string;
      team_b_score: number;
    }
  }

  export namespace Level {
    export type Type = "House" | "Quarters" | "Semi" | "Final";

    export interface LevelCreateData {
      type: Type;
      teams: Team.FullTeam[];
    }

    export interface FullLevel {
      id: string;
      event_id: string;
      type: Type;
    }
  }

  export namespace Team {
    export interface FullTeam {
      id: string;
      created_at: string;
      creator_id: string;
      name: string;
      photo_url: string | string;
      fb_uid: string | string;
    }
  }

  export namespace Article {
    export interface FullArticle {
      id: string;
      title: string;
      preview: string;
      created_at: string;
      content: string;
      images: string[];
    }
  }
}
