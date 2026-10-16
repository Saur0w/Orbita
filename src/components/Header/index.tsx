"use client";

import { useState, useRef, useEffect } from "react";
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

const languages = ["En", "Ger"] as const;
type Language = (typeof languages)[number];

export default function Header() {
    const [selectedLang, setSelectedLang] = useState<Language>("En");
    const [isLangOpen, setIsLangOpen] = useState(false);
    const rightWrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                rightWrapperRef.current &&
                !rightWrapperRef.current.contains(e.target as Node)
            ) {
                setIsLangOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

            <div ref={rightWrapperRef} className={styles.rightWrapper}>
                <div className={styles.rightPill}>
                    <button
                        type="button"
                        className={styles.langButton}
                        aria-label="Select language"
                        aria-expanded={isLangOpen}
                        onClick={() => setIsLangOpen((prev) => !prev)}
                    >
                        <span>{selectedLang}</span>
                        <svg
                            className={`${styles.chevron} ${isLangOpen ? styles.chevronOpen : ""}`}
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
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_749_1680)">
                                <path
                                    opacity="0.2"
                                    d="M1.72003 12.0002C1.72003 17.6777 6.32254 22.2802 12 22.2802C17.6775 22.2802 22.28 17.6777 22.28 12.0002C22.28 6.32273 17.6775 1.72021 12 1.72021C6.32254 1.72021 1.72003 6.32273 1.72003 12.0002Z"
                                    fill="#F7F1E8"
                                />
                                <path
                                    d="M12 22.2802C6.32254 22.2802 1.72003 17.6777 1.72003 12.0002C1.72003 6.32273 6.32254 1.72021 12 1.72021C17.6775 1.72021 22.28 6.32273 22.28 12.0002C22.28 17.6777 17.6775 22.2802 12 22.2802Z"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    stroke="#4B4841"
                                />
                                <path
                                    d="M11.9999 22.2802C9.5919 22.2802 7.63986 17.6777 7.63986 12.0002C7.63986 6.32273 9.5919 1.72021 11.9999 1.72021C14.4078 1.72021 16.3599 6.32273 16.3599 12.0002C16.3599 17.6777 14.4078 22.2802 11.9999 22.2802Z"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    stroke="#4B4841"
                                />
                                <path
                                    d="M1.71997 12H22.28"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    stroke="#4B4841"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_749_1680">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>

                {/* 62x62 Language Dropdown (Frame 214) */}
                <div
                    className={`${styles.langDropdown} ${isLangOpen ? styles.langDropdownOpen : ""}`}
                    role="menu"
                    aria-label="Language options"
                >
                    {languages.map((lang) => (
                        <button
                            key={lang}
                            type="button"
                            role="menuitem"
                            className={`${styles.langOption} ${
                                selectedLang === lang ? styles.langOptionActive : ""
                            }`}
                            onClick={() => {
                                setSelectedLang(lang);
                                setIsLangOpen(false);
                            }}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}