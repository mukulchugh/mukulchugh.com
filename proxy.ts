import { type NextRequest, NextResponse } from "next/server";
import { preferredRepresentation } from "@/lib/accept";

export function proxy(request: NextRequest) {
  // Flight, actions, APIs and assets retain their own content protocols.
  if (
    !["GET", "HEAD"].includes(request.method) ||
    request.headers.get("rsc") === "1"
  ) {
    return NextResponse.next();
  }
  const representation = preferredRepresentation(request.headers.get("accept"));
  let response: NextResponse;
  if (representation === "text/markdown") {
    const url = request.nextUrl.clone();
    url.pathname = `/markdown${url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "")}`;
    response = NextResponse.rewrite(url);
  } else if (representation === null) {
    response = new NextResponse(
      "Not acceptable. Available representations: text/html, text/markdown.\n",
      {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; charset=utf-8",
        },
        status: 406,
      }
    );
  } else {
    response = NextResponse.next();
    // Next 16.3's page renderer overwrites Vary. Until it preserves Accept,
    // HTML must be revalidated and must not enter a shared intermediary cache.
    response.headers.set("Cache-Control", "private, no-cache");
  }
  response.headers.set("Vary", "Accept, Accept-Encoding");
  response.headers.set("Link", '</llms.txt>; rel="describedby"');
  return response;
}

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|markdown(?:/|$)|og(?:/|$)|prototype(?:/|$)|.*\\.).*)",
  ],
};
