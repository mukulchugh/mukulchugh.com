import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Rebound } from "@/components/rebound/rebound";
export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Rebound · prototype",
};
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="mx-auto max-w-[1200px] px-3 py-8 pb-32 sm:px-8">
      <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>ISOLATED PROTOTYPE</span>
        <a className="underline underline-offset-4" href="/">
          Back to portfolio
        </a>
      </div>
      <Rebound />
    </main>
  );
}
