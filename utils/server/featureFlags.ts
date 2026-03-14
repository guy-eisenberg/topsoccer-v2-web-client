import { get } from "@vercel/edge-config";
import { unstable_cache } from "next/cache";

export async function getFeatureFlag(
  key: string,
  defaultValue = true,
): Promise<boolean> {
  return unstable_cache(
    async () => {
      try {
        const value = await get<boolean>(key);
        return value ?? defaultValue;
      } catch {
        return defaultValue;
      }
    },
    [key],
    { revalidate: 300 },
  )();
}
