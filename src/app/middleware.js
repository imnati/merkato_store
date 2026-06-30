// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // 1. ተጠቃሚው ወደ /admin ፎልደር እየገባ ከሆነ
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 2. 'admin_token' የሚባል Cookie መኖሩን ይፈትሻል
    const authCookie = request.cookies.get("admin_token");

    // 3. Cookie ከሌለ ወደ /login ገጽ ይመልሰዋል
    if (!authCookie) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // ሁሉም ነገር ደህና ከሆነ ወደሚፈልገው ገጽ እንዲሄድ ይፈቅድለታል
  return NextResponse.next();
}
