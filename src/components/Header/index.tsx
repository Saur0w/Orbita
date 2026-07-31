"use client";

import styles from "./style.module.scss";
import Link from "next/link";

const navLinksLeft = [
    { label: "AE.1", href: "/" },
    { label: "Technology", href: "/" },
    { label: "Specs", href: "/" },
];

const navLinksRight = [
    { label: "Experience", href: "/" },
    { label: "Buy it now", href: "/" },
];

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.body}>
                {/* Left Nav + Hamburger Menu */}
                <div className={styles.navLeft}>
                    <button className={styles.menuBtn} aria-label="Open menu">
                        <span />
                        <span />
                    </button>
                    <nav>
                        <ul>
                            {navLinksLeft.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Center Logo with Flanking Spark Stars */}
                <div className={styles.logo}>
                    <Link href="/">
                        <div className={styles.logoWrapper}>
                            <div className={styles.stars}>
                                <span>✦</span>
                                <span>✦</span>
                            </div>
                            <span className={styles.brandText}>LIGHTSHIP</span>
                        </div>
                    </Link>
                </div>

                {/* Right Nav */}
                <div className={styles.navRight}>
                    <nav>
                        <ul>
                            {navLinksRight.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}