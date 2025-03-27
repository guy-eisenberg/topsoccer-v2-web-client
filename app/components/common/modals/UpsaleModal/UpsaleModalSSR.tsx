import { fetchBanners } from "@/utils/server/fetchBanners";
import UpsaleModal from "./UpsaleModal";

export default async function UpsaleModalSSR() {
  const banners = await fetchBanners();

  return <UpsaleModal banners={banners} />;
}
