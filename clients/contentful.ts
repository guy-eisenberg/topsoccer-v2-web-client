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
    const {
      fields: { url },
    } = await contentful.getEntry(ENTRIES.MAIN_WHATSAPP_LINK);

    return url as string;
  }

  static async getWhatsappGroupLinks() {
    const {
      fields: { urls },
    } = await contentful.getEntry(ENTRIES.WHATSAPP_GROUPS_LINKS);

    return urls as { label: string; url: string }[];
  }

  static async getSocialLinks() {
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
  }

  static async getWeeklyBestMoveLink() {
    const {
      fields: { url },
    } = await contentful.getEntry(ENTRIES.WEEKLY_BEST_MOVE_LINK);

    return url as string;
  }

  static async getAvailableTickets() {
    const {
      fields: { tickets },
    } = await contentful.getEntry(ENTRIES.TICKETS);

    return tickets as Topsoccer.Ticket.Object[];
  }

  static async getWelcomeComment() {
    const {
      fields: { text },
    } = await contentful.getEntry(ENTRIES.WELCOME_COMMENT);

    return text as string;
  }

  static async getHomepageAlert() {
    const {
      fields: { content },
    } = await contentful.getEntry(ENTRIES.HOMEPAGE_ALERT);

    return content as string;
  }

  static async getUpsalesBanners() {
    const {
      fields: { banners },
    } = await contentful.getEntry(ENTRIES.UPSALES_BANNERS);

    return banners as { fields: { file: { url: string } } }[];
  }
}
