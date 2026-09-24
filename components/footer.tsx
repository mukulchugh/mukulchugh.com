import { IconArrowUp, IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { footerSocialLinks, siteConfig } from "@/lib/data";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer
      aria-label="Portfolio footer"
      className={`bento-surface ${styles.tile}`}
    >
      <div className={styles.signature}>
        <Link className={styles.name} href="/">
          {siteConfig.name}
        </Link>
        <p className={styles.note}>Still building.</p>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
      <nav aria-label="Footer links" className={styles.links}>
        {[
          ["GitHub", "Blog"],
          ["LinkedIn", "Twitter"],
        ].map((names) => (
          <div className={styles.column} key={names[0]}>
            {names.map((name) => {
              const link = footerSocialLinks.find((item) => item.name === name);
              if (!link) return null;
              const internal = name === "Blog";
              return (
                <Link
                  className={styles.link}
                  href={internal ? "/blog" : link.href}
                  key={name}
                  rel={internal ? undefined : "noopener noreferrer"}
                  target={internal ? undefined : "_blank"}
                >
                  <span>
                    {internal ? "Writing" : name === "Twitter" ? "X" : name}
                  </span>
                  <IconArrowUpRight aria-hidden="true" size={20} stroke={1.5} />
                  {!internal && (
                    <span className="sr-only"> (opens in a new tab)</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
        <a className={styles.top} href="#top">
          Back to top <IconArrowUp aria-hidden="true" size={16} stroke={1.5} />
        </a>
      </nav>
    </footer>
  );
}
