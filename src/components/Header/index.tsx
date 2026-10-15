"use client";

import styles from "./style.module.scss";
import Link from "next/link";
import { Logo } from "@/components/Icons/logo"; 
interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: "The Lamp", href: "/" },
    { label: "Features", href: "/" },
    { label: "Pre-order", href: "/" },
    { label: "Specification", href: "/" },
];

export default function Header() {
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logoLink} aria-label="Orbita Home">
                <Logo className={styles.logo} />
            </Link>

            <nav className={styles.navPill} aria-label="Primary Navigation">
                <ul className={styles.navList}>
                    {navItems.map((item) => (
                        <li key={item.label} className={styles.navItem}>
                            <Link href={item.href} className={styles.navLink}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={styles.rightPill}>
                <button
                    type="button"
                    className={styles.langButton}
                    aria-label="Select language"
                >
                    <span>En</span>
                    <svg
                        className={styles.chevron}
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M1 1.5L6 6.5L11 1.5"
                            stroke="currentColor"
                            strokeWidth="1.35"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <button
                    type="button"
                    className={styles.iconCircle}
                    aria-label="Menu or region settings"
                >
                    <svg
                        className={styles.globeIcon}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <circle
                            cx="10"
                            cy="10"
                            r="7.25"
                            stroke="currentColor"
                            strokeWidth="1.2"
                        />
                        <ellipse
                            cx="10"
                            cy="10"
                            rx="3.2"
                            ry="7.25"
                            stroke="currentColor"
                            strokeWidth="1.2"
                        />
                        <line
                            x1="2.75"
                            y1="10"
                            x2="17.25"
                            y2="10"
                            stroke="currentColor"
                            strokeWidth="1.2"
                        />
                    </svg>

                    <svg
                        className={styles.menuIcon}
                        viewBox="0 0 18 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <line
                            x1="1"
                            y1="1.5"
                            x2="17"
                            y2="1.5"
                            stroke="currentColor"
                            strokeWidth="1.35"
                            strokeLinecap="round"
                        />
                        <line
                            x1="1"
                            y1="6"
                            x2="17"
                            y2="6"
                            stroke="currentColor"
                            strokeWidth="1.35"
                            strokeLinecap="round"
                        />
                        <line
                            x1="1"
                            y1="10.5"
                            x2="17"
                            y2="10.5"
                            stroke="currentColor"
                            strokeWidth="1.35"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
}