import { type NextRequest } from "next/server";
import { updateSession } from "./app/utils/cookies";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
