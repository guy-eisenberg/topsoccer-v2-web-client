import { headers } from "next/headers";

export async function getOrigin() {
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (!origin) throw new Error("Origin header is not set.");

  return origin;
}
