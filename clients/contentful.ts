import type { Topsoccer } from "@/types";
import * as _contentful from "contentful";

const contentful = _contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
});

const ENTRIES = {
  MAIN_WHATSAPP_LINK: "yWzemAZyJRIbked6vg7U2",
  WHATSAPP_GROUPS_LINKS: "4JsMoo2G9UAGsyhChq64u8",
  INSTAGRAM_LINK: "2Wp7uFaxTDVg192AEYNkjH",
  FACEBOOK_LINK: "5VyLMisemrIYPYmbkpKZOm",
  TIKTOK_LINK: "3XIaiKHYzH6P9nUeTR784X",
  WEEKLY_BEST_MOVE_LINK: "2EhS6vTHz8DxvnANGlE05M",
  TICKETS: "1e14h1EXA3PMUhM7C2AaYV",
  WELCOME_COMMENT: "3wqvohOiXe69pFM8oAspsE",
  HOMEPAGE_ALERT: "7fgpswRWcOVv3AL4tM1nHF",
  UPSALES_BANNERS: "1Jx93eZUIf0x5PO7Ehhgyk",
};

export class Contentful {
  static async getMainWhatsappLink() {
    try {
      const {
        fields: { url },
      } = await contentful.getEntry(ENTRIES.MAIN_WHATSAPP_LINK);

      return url as string;
    } catch {
      return "https://api.whatsapp.com/send/?phone=972549733105";
    }
  }

  static async getWhatsappGroupLinks() {
    try {
      const {
        fields: { urls },
      } = await contentful.getEntry(ENTRIES.WHATSAPP_GROUPS_LINKS);

      return urls as { label: string; url: string }[];
    } catch {
      return [
        {
          label: "ראשל״צ 7X7",
          url: "https://chat.whatsapp.com/G1hLwYWQ52PH5pv2s23xv6",
        },
        {
          label: "רמת גן 7X7",
          url: "https://chat.whatsapp.com/JCyaApU33b5155SGAwhjOl",
        },
        {
          label: "ראשל״צ 6X6",
          url: "https://chat.whatsapp.com/JrBa3Y9Mx2kC7c2fXB2X29",
        },
      ];
    }
  }

  static async getSocialLinks() {
    try {
      const {
        fields: { url: instagram },
      } = await contentful.getEntry(ENTRIES.INSTAGRAM_LINK);
      const {
        fields: { url: facebook },
      } = await contentful.getEntry(ENTRIES.FACEBOOK_LINK);
      const {
        fields: { url: tiktok },
      } = await contentful.getEntry(ENTRIES.TIKTOK_LINK);

      return { instagram, facebook, tiktok } as {
        instagram: string;
        facebook: string;
        tiktok: string;
      };
    } catch {
      return {
        instagram: "https://www.instagram.com/topsoccerisrael",
        facebook: "https://www.facebook.com/topsoccerisrael",
        tiktok: "https://www.tiktok.com/@topsoccerisrael",
      };
    }
  }

  static async getWeeklyBestMoveLink() {
    try {
      const {
        fields: { url },
      } = await contentful.getEntry(ENTRIES.WEEKLY_BEST_MOVE_LINK);

      return url as string;
    } catch {
      return "https://www.youtube.com/embed/1FF37seNwxM?si=ZH59_PdKb9EjIeAt";
    }
  }

  static async getAvailableTickets() {
    try {
      const {
        fields: { tickets },
      } = await contentful.getEntry(ENTRIES.TICKETS);

      return tickets as Topsoccer.Ticket.Object[];
    } catch {
      return [
        {
          id: "0",
          title: "כרטיסיית מתחילים",
          amount: 5,
          price: 230,
        },
        {
          id: "1",
          title: "כרטיסיית מתקדמים",
          amount: 10,
          price: 450,
        },
        {
          id: "2",
          title: "כרטיסיית פנטזי",
          amount: 24,
          price: 1000,
        },
      ];
    }
  }

  static async getWelcomeComment() {
    try {
      const {
        fields: { text },
      } = await contentful.getEntry(ENTRIES.WELCOME_COMMENT);

      return text as string;
    } catch {
      return "⚽ ברוכים הבאים לטופסוקר! ⚽";
    }
  }

  static async getHomepageAlert() {
    try {
      const {
        fields: { content },
      } = await contentful.getEntry(ENTRIES.HOMEPAGE_ALERT);

      return content as string;
    } catch {
      return "מתזכרים את כולם שההשתתפות במשחקי הכדורגל בטופ סוקר באחריות השחקן ואין ביטוח על פציעות שחקנים";
    }
  }

  static async getUpsalesBanners() {
    try {
      const {
        fields: { banners },
      } = await contentful.getEntry(ENTRIES.UPSALES_BANNERS);

      return banners as { fields: { file: { url: string } } }[];
    } catch {
      return [];
    }
  }
}
