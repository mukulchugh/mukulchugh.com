const noStore = { "Cache-Control": "no-store" };
type Context = { params: Promise<{ path: string[] }> };

function sameOrigin(request: Request) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  return (
    (!origin || origin === url.origin) &&
    request.headers.get("sec-fetch-site") !== "cross-site"
  );
}

async function boundedBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    // biome-ignore lint/performance/noAwaitInLoops: stream chunks must be bounded in order.
    const chunk = await reader.read();
    if (chunk.done) break;
    bytes += chunk.value.byteLength;
    if (bytes > 524_288) {
      await reader.cancel();
      return null;
    }
    chunks.push(chunk.value);
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

async function proxy(request: Request, { params }: Context) {
  const path = (await params).path.join("/");
  const url = new URL(request.url);
  const asset = /^(?:static|array)\/[a-zA-Z0-9_./-]{1,256}$/.test(path);
  const ingestion = ["e", "i/v0/e", "flags"].includes(path.replace(/\/$/, ""));
  if (!(asset || ingestion)) return new Response(null, { status: 404 });
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  if (
    request.headers.get("dnt") === "1" ||
    request.headers.get("sec-gpc") === "1"
  )
    return new Response(null, { headers: noStore, status: 204 });
  if (url.search.length > 16_384) return new Response(null, { status: 413 });
  if (
    (asset && request.method !== "GET") ||
    (ingestion && request.method !== "POST")
  )
    return new Response(null, { status: 405 });

  const body = ingestion ? await boundedBody(request) : undefined;
  if (body === null) return new Response(null, { status: 413 });
  const upstream = new URL(
    `https://${asset ? "us-assets.i.posthog.com" : "us.i.posthog.com"}/${path}`
  );
  upstream.search = url.search;
  try {
    const response = await fetch(upstream, {
      body: ingestion ? body : undefined,
      cache: "no-store",
      headers: {
        ...(request.headers.get("content-encoding")
          ? { "Content-Encoding": request.headers.get("content-encoding")! }
          : {}),
        ...(request.headers.get("content-type")
          ? { "Content-Type": request.headers.get("content-type")! }
          : {}),
        "User-Agent":
          request.headers.get("user-agent") || "portfolio-analytics",
      },
      method: request.method,
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok)
      return new Response(null, { headers: noStore, status: 502 });
    return new Response(await response.arrayBuffer(), {
      headers: {
        "Cache-Control": asset ? "public, max-age=3600" : "no-store",
        "Content-Type":
          response.headers.get("content-type") ||
          (asset
            ? "application/javascript; charset=utf-8"
            : "application/json"),
        "X-Content-Type-Options": "nosniff",
      },
      status: response.status,
    });
  } catch {
    return new Response(null, { headers: noStore, status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
