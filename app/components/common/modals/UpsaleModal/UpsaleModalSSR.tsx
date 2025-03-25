import { Contentful } from "@/clients/contentful";
import UpsaleModal from "./UpsaleModal";

export default async function UpsaleModalSSR() {
  const banners = await fetchBanners();

  return <UpsaleModal banners={banners} />;
}

async function fetchBanners() {
  const banners = await Contentful.getUpsalesBanners();

  return banners.map((b) => `https://${b.fields.file.url.slice(2)}`);
}
