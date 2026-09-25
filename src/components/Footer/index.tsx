"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";
import { Logo } from "../Icons/logo";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "The Lamp", href: "#the-lamp" },
  { label: "Features", href: "#features" },
  { label: "Specification", href: "#specification" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://x.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        <div className={styles.logoCol}>
          <Link href="/" aria-label="Orbita Home" className={styles.logoLink}>
            <Logo className={styles.logo} />
          </Link>
        </div>

        <div className={styles.emailCol}>
          <span className={styles.columnLabel}>(Email)</span>
          <a href="mailto:hello@orbitalight.com" className={styles.emailLink}>
            hello@orbitalight.com
          </a>
        </div>

        <div className={styles.navCol}>
          <span className={styles.columnLabel}>(Navs)</span>
          <ul className={styles.linkList}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.linkItem}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.socialsCol}>
          <span className={styles.columnLabel}>(Socials)</span>
          <ul className={styles.linkList}>
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkItem}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.imageSection}>
        <Image
          src="/images/footer.png"
          alt="Orbita Lamp preview"
          fill
          priority
          unoptimized
          className={styles.bannerImage}
        />

      </div>
    </footer>
  );
}