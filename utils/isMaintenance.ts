import { get } from "@vercel/edge-config";

export async function isMaintenance() {
  if (!process.env.EDGE_CONFIG) return false;

  return await get("isInMaintenanceMode");
}
