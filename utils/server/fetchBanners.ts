import { Contentful } from "@/clients/contentful";

export async function fetchBanners() {
  const banners = await Contentful.getUpsalesBanners();

  return banners.map((b) => `https://${b.fields.file.url.slice(2)}`);
}
