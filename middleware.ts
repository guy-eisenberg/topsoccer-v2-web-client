import { getSessionFromCode, updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { isMaintenance } from "./utils/isMaintenance";

export async function middleware(request: NextRequest) {
  const maintenance = await isMaintenance();
  if (maintenance) {
    request.nextUrl.pathname = "/maintenance";

    return NextResponse.rewrite(request.nextUrl);
  }

  const code = request.nextUrl.searchParams.get("code");

  if (code) return getSessionFromCode(request, code);

  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (faxn file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
