import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandBar } from "@/components/bento/brand-bar";
import { LocationTile } from "@/components/bento/location-tile";
import { ProfileTile } from "@/components/bento/profile-tile";
import { TensionStudy } from "./tension-study";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Make the connection prototype",
};

// Isolated, single-direction prototype. The homepage is intentionally unchanged.
export default function TensionPrototypePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="bento-page home-design">
      <BrandBar />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>Prototype only. Pull the lime ball, then let it fly.</p>
        <a
          className="inline-flex min-h-11 items-center underline underline-offset-4"
          href="/"
        >
          Compare with current homepage
        </a>
      </div>
      <div className="bento-hero-grid">
        <ProfileTile />
        <div
          className="bento-hero-side"
          style={{ gridTemplateRows: "auto auto" }}
        >
          <TensionStudy />
          <LocationTile />
        </div>
      </div>
      <p className="mt-6 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
        Connect all three gates in as few shots as you can. Pull opposite the
        direction you want to launch. Use the walls, or catch the ball and aim
        again. Keyboard: Enter to aim, arrows to pull, Enter to launch. Escape
        returns the ball to its starting position.
      </p>
    </main>
  );
}
