import { PageJsonLd } from "@/components/page-json-ld";
import { PageShell } from "@/components/page-shell";
import { privacyProviders, privacySections } from "@/lib/privacy";
import { publicPages, staticMetadata } from "@/lib/seo";

export const metadata = staticMetadata("/privacy");

export default function PrivacyPage() {
  return (
    <PageShell contact={false}>
      <main className="page-content">
        <PageJsonLd
          description={publicPages["/privacy"].description}
          path="/privacy"
          title="Privacy"
          type="WebPage"
        />
        <article className="bento-surface p-6 sm:p-10">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Privacy.
          </h1>
          <div className="mt-8 max-w-[65ch] space-y-8 text-base leading-8 text-muted-foreground">
            {privacySections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <p>{section.body}</p>
              </section>
            ))}
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {privacyProviders.map(([name, href]) => (
                <li key={name}>
                  <a className="underline underline-offset-4" href={href}>
                    {name} privacy policy
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </main>
    </PageShell>
  );
}
