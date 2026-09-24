import { cleanUrl, GA_ID, portfolioEvents } from "@/lib/analytics-config";

const eventNames = new Set<string>(["page_view", ...portfolioEvents]);
const noStore = { "Cache-Control": "no-store" };
type Context = { params: Promise<{ path: string[] }> };

function sanitize(params: URLSearchParams) {
  for (const key of ["dl", "dr"]) {
    if (params.has(key)) params.set(key, cleanUrl(params.get(key) || ""));
  }
  for (const key of [...params.keys()]) {
    if (/^(uid|uip|user_id|user_data|up\.|upn\.)/.test(key)) params.delete(key);
    if (
      /^ep\./.test(key) &&
      ![
        "ep.analytics_source",
        "ep.page_path",
        "ep.destination",
        "ep.link_host",
        "ep.surface",
      ].includes(key)
    )
      params.delete(key);
  }
  return params;
}

// Fixed Google endpoints only. No cookies, authorization, or visitor IP forwarding.
async function proxy(request: Request, { params }: Context) {
  const started = Date.now();
  const path = (await params).path.join("/");
  const url = new URL(request.url);
  const workerAsset =
    /^_\/service_worker\/[a-zA-Z0-9_-]{1,32}\/(sw_iframe\.html|sw\.js)$/.test(
      path
    );
  if (!(["gtag/js", "g/collect"].includes(path) || workerAsset))
    return new Response(null, { status: 404 });
  const origin = request.headers.get("origin");
  if (
    (origin && origin !== url.origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return new Response(null, { status: 403 });
  if (
    request.headers.get("dnt") === "1" ||
    request.headers.get("sec-gpc") === "1"
  )
    return new Response(null, { headers: noStore, status: 204 });
  if (url.search.length > 16_384) return new Response(null, { status: 413 });
  if (workerAsset) {
    if (request.method !== "GET") return new Response(null, { status: 405 });
    try {
      const asset = await fetch(
        `https://www.googletagmanager.com/static/${path.slice(2)}`,
        {
          redirect: "error",
          signal: AbortSignal.timeout(8000),
        }
      );
      if (!asset.ok)
        return new Response(null, { headers: noStore, status: 502 });
      return new Response(await asset.text(), {
        headers: {
          "Cache-Control": "public, max-age=3600",
          "Content-Type": path.endsWith(".html")
            ? "text/html; charset=utf-8"
            : "application/javascript; charset=utf-8",
          "Service-Worker-Allowed": "/api/analytics/google/_/service_worker/",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      return new Response(null, { headers: noStore, status: 502 });
    }
  }
  const script = path === "gtag/js";
  if (script && request.method !== "GET")
    return new Response(null, { status: 405 });
  if (url.searchParams.get(script ? "id" : "tid") !== GA_ID)
    return new Response(null, { status: 400 });

  try {
    let body: string | undefined;
    if (!script && request.method === "POST") {
      // Bound the streamed body too; Content-Length can be absent or misleading.
      const reader = request.body?.getReader();
      const decoder = new TextDecoder();
      let bytes = 0;
      body = "";
      if (reader) {
        while (true) {
          // biome-ignore lint/performance/noAwaitInLoops: stream chunks must be read and bounded in order.
          const chunk = await reader.read();
          if (chunk.done) break;
          bytes += chunk.value.byteLength;
          if (bytes > 65_536) {
            await reader.cancel();
            return new Response(null, { status: 413 });
          }
          body += decoder.decode(chunk.value, { stream: true });
        }
        body += decoder.decode();
      }
    }
    if (!script) {
      // Only explicit shared-layer events pass. Google enhanced measurement cannot
      // silently introduce duplicate pageviews or capture form/search contents.
      const lines = body ? body.split("\n") : [""];
      const allowed = lines.every((line) => {
        const hit = new URLSearchParams(url.searchParams);
        for (const [key, value] of new URLSearchParams(line))
          hit.set(key, value);
        return (
          hit.get("tid") === GA_ID &&
          eventNames.has(hit.get("en") || "") &&
          hit.get("ep.analytics_source") === "portfolio"
        );
      });
      if (!allowed)
        return new Response(null, { headers: noStore, status: 204 });
      sanitize(url.searchParams);
      if (body)
        body = lines
          .map((line) => sanitize(new URLSearchParams(line)).toString())
          .join("\n");
    }
    const upstream = new URL(
      script
        ? "https://www.googletagmanager.com/gtag/js"
        : "https://www.google-analytics.com/g/collect"
    );
    upstream.search = script
      ? new URLSearchParams({ id: GA_ID }).toString()
      : url.searchParams.toString();
    const response = await fetch(upstream, {
      body: request.method === "POST" ? body : undefined,
      cache: "no-store",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "User-Agent":
          request.headers.get("user-agent") || "portfolio-analytics",
      },
      method: request.method,
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Analytics upstream unavailable");
    return new Response(script ? await response.text() : null, {
      headers: script
        ? {
            "Cache-Control": "public, max-age=3600",
            "Content-Type": "application/javascript; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
          }
        : noStore,
      status: script ? 200 : 204,
    });
  } catch {
    // Never log measurement bodies, URLs, identifiers, or exception payloads.
    console.error(
      JSON.stringify({
        duration_ms: Date.now() - started,
        level: "error",
        message: "upstream_failed",
        route: "analytics/google",
      })
    );
    return new Response(null, { headers: noStore, status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
