import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { siteConfig } from "@/lib/data";
import { publicDocument } from "@/lib/public-content";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const key = (await params).path.join("/");
  const pagePath = key === "home.png" ? "/" : `/${key.replace(/\.png$/, "")}`;
  const doc = key.endsWith(".png") ? publicDocument(pagePath) : undefined;
  if (!doc)
    return new Response("Image not found", {
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
      status: 404,
    });
  const [headingFont, bodyFont] = await Promise.all([
    readFile(path.join(process.cwd(), "public/fonts/og/syne-semibold.ttf")),
    readFile(path.join(process.cwd(), "public/fonts/og/geist-regular.ttf")),
  ]);
  // Only registry-owned local artwork is read. Never fetch request-supplied URLs.
  const artPath = doc.image.startsWith("/design/")
    ? doc.image
    : siteConfig.images.profileImage;
  let art: Buffer;
  let artBackground = "#e9e9e3";
  try {
    const source = path.join(process.cwd(), "public", artPath);
    if (doc.kind !== "page") {
      const corner = await sharp(source)
        .extract({ height: 1, left: 0, top: 0, width: 1 })
        .removeAlpha()
        .raw()
        .toBuffer();
      artBackground = `#${corner.subarray(0, 3).toString("hex")}`;
    }
    art = await sharp(source)
      .resize(500, 510, { background: artBackground, fit: "contain" })
      .png()
      .toBuffer();
  } catch {
    art = await sharp(
      path.join(process.cwd(), "public", siteConfig.images.profileImage)
    )
      .resize(500, 510, { background: "#e9e9e3", fit: "contain" })
      .png()
      .toBuffer();
  }
  const isHome = pagePath === "/";
  const light = doc.kind === "article";
  const background = isHome ? "#d6ff58" : light ? "#f4f3ee" : "#171918";
  const foreground = isHome || light ? "#171918" : "#f4f3ee";
  const label =
    doc.kind === "article"
      ? "NOTES FROM THE WORK"
      : doc.kind === "project"
        ? "PROJECT NOTES"
        : pagePath === "/"
          ? "ENGINEER BY CRAFT. BUILDER BY DESIGN."
          : doc.title.toUpperCase();
  return new ImageResponse(
    <div
      style={{
        background,
        color: foreground,
        display: "flex",
        fontFamily: "Geist",
        gap: 32,
        height: "100%",
        padding: 40,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 640,
        }}
      >
        <div style={{ display: "flex", fontSize: 15, letterSpacing: 2.2 }}>
          {label}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Syne",
              fontSize:
                doc.heading.length > 70
                  ? 46
                  : doc.heading.length > 42
                    ? 58
                    : 76,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {doc.heading}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 23,
              lineHeight: 1.4,
              opacity: 0.72,
            }}
          >
            {doc.description.length > 185
              ? `${doc.description.slice(0, 182).replace(/\s+\S*$/, "")}…`
              : doc.description}
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            borderTop: `1px solid ${light || isHome ? "#17191833" : "#f4f3ee33"}`,
            display: "flex",
            fontSize: 18,
            justifyContent: "space-between",
            paddingTop: 20,
          }}
        >
          <span>Mukul Chugh</span>
          <span style={{ opacity: 0.6 }}>mukulchugh.com</span>
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          background: artBackground,
          border: "1px solid #88888833",
          borderRadius: 28,
          display: "flex",
          height: 550,
          justifyContent: "center",
          overflow: "hidden",
          width: 408,
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: ImageResponse renders embedded PNGs, not browser HTML. */}
        <img
          alt=""
          height={416}
          src={`data:image/png;base64,${art.toString("base64")}`}
          style={{ objectFit: "contain" }}
          width={408}
        />
      </div>
    </div>,
    {
      fonts: [
        { data: headingFont, name: "Syne", style: "normal", weight: 600 },
        { data: bodyFont, name: "Geist", style: "normal", weight: 400 },
      ],
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
      height: 630,
      width: 1200,
    }
  );
}
