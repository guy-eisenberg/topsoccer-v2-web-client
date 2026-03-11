import { get } from "@vercel/edge-config";

export async function getFeatureFlag(
  key: string,
  defaultValue = true,
): Promise<boolean> {
  try {
    const value = await get<boolean>(key);
    return value ?? defaultValue;
  } catch {
    return defaultValue;
  }
}
