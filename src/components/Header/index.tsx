"use client";

import { useState, useRef, useEffect, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, useTransitionRouter } from "next-view-transitions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Logo } from "@/components/Icons/logo";
import styles from "./style.module.scss";

if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface LenisLike {
    scrollTo?: (
        target: HTMLElement | number | string,
        options?: { immediate?: boolean; force?: boolean; offset?: number; duration?: number }
    ) => void;
}

type DocumentWithTransition = Document & {
    startViewTransition?: (callback: () => void) => unknown;
};

const languages = [
    { label: "En", code: "en" },
    { label: "De", code: "de" },
] as const;

type LanguageLabel = (typeof languages)[number]["label"];
type LocaleCode = (typeof languages)[number]["code"];

const TOP_THRESHOLD = 80;
const HIDE_THRESHOLD = 28;
const SHOW_THRESHOLD = 16;
const HIDDEN_Y = -100;

function setLocaleCookie(code: LocaleCode) {
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`;
}

interface HeaderProps {
    isReady: boolean;
}

export default function Header({ isReady }: HeaderProps) {
    const headerRef = useRef<HTMLElement>(null);
    const rightWrapperRef = useRef<HTMLDivElement>(null);
    const lastScrollYRef = useRef(0);
    const directionAccumRef = useRef(0);
    const isHiddenRef = useRef(false);
    const isJumpingRef = useRef(false);

    const [isLangOpen, setIsLangOpen] = useState(false);

    const router = useRouter();
    const transitionRouter = useTransitionRouter();
    const currentLocale = useLocale() as LocaleCode;
    const t = useTranslations("Header");

    const selectedLang: LanguageLabel =
        languages.find((l) => l.code === currentLocale)?.label ?? "En";

    const navItems = [
        { label: t("theLamp"), href: "/#the-lamp", isHash: true },
        { label: t("features"), href: "/#features", isHash: true },
        { label: t("preorder"), href: "/preorder", isHash: false },
        { label: t("specification"), href: "/#specification", isHash: true },
    ];

    const getLenis = (): LenisLike | undefined => {
        if (typeof window === "undefined") return undefined;
        return (window as unknown as { lenis?: LenisLike }).lenis;
    };

    const showHeader = () => {
        if (!headerRef.current || !isHiddenRef.current) return;
        isHiddenRef.current = false;
        headerRef.current.classList.remove(styles.headerHidden);

        gsap.to(headerRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            force3D: true,
            overwrite: "auto",
        });
    };

    const hideHeader = () => {
        if (!headerRef.current || isHiddenRef.current) return;
        isHiddenRef.current = true;
        headerRef.current.classList.add(styles.headerHidden);
        setIsLangOpen(false);

        gsap.to(headerRef.current, {
            y: HIDDEN_Y,
            duration: 0.65,
            ease: "power2.inOut",
            force3D: true,
            overwrite: "auto",
        });
    };

    const jumpWithTransition = (getTop: () => number | null, hash?: string) => {
        const performJump = () => {
            const top = getTop();
            if (top === null) return;

            isJumpingRef.current = true;

            const lenis = getLenis();
            if (lenis?.scrollTo) {
                lenis.scrollTo(top, { immediate: true, force: true });
            } else {
                window.scrollTo(0, top);
            }

            ScrollTrigger.update();

            if (hash !== undefined) {
                window.history.replaceState(null, "", hash || window.location.pathname);
            }

            if (top <= TOP_THRESHOLD) {
                showHeader();
            }

            requestAnimationFrame(() => {
                lastScrollYRef.current = Math.max(window.scrollY, 0);
                directionAccumRef.current = 0;
                isJumpingRef.current = false;
            });
        };

        const doc = document as DocumentWithTransition;
        if (doc.startViewTransition) {
            doc.startViewTransition(performJump);
        } else {
            performJump();
        }
    };

    const handleLanguageChange = (code: LocaleCode) => {
        setLocaleCookie(code);
        setIsLangOpen(false);
        router.refresh();
    };

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

    useGSAP(
        () => {
            if (!isReady) {
                gsap.set(headerRef.current, {
                    y: -24,
                    opacity: 0,
                    force3D: true,
                });
                return;
            }

            isHiddenRef.current = false;
            headerRef.current?.classList.remove(styles.headerHidden);

            gsap.to(headerRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.1,
                force3D: true,
                overwrite: "auto",
            });
        },
        {
            dependencies: [isReady],
            scope: headerRef,
        }
    );

    useEffect(() => {
        if (!isReady) return;

        lastScrollYRef.current = Math.max(window.scrollY, 0);
        directionAccumRef.current = 0;

        const handleScroll = () => {
            const currentY = Math.max(window.scrollY, 0);

            if (isJumpingRef.current) {
                lastScrollYRef.current = currentY;
                directionAccumRef.current = 0;
                return;
            }

            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;

            if (currentY <= TOP_THRESHOLD) {
                showHeader();
                lastScrollYRef.current = currentY;
                directionAccumRef.current = 0;
                return;
            }

            // Ignore rubber-band overscroll past the bottom of the document
            if (currentY >= maxScroll) {
                lastScrollYRef.current = currentY;
                return;
            }

            const diff = currentY - lastScrollYRef.current;
            lastScrollYRef.current = currentY;

            if (diff === 0) return;

            // Reset accumulator when scroll direction reverses
            if (
                (diff > 0 && directionAccumRef.current < 0) ||
                (diff < 0 && directionAccumRef.current > 0)
            ) {
                directionAccumRef.current = 0;
            }

            directionAccumRef.current += diff;

            if (directionAccumRef.current >= HIDE_THRESHOLD) {
                hideHeader();
                directionAccumRef.current = 0;
            } else if (directionAccumRef.current <= -SHOW_THRESHOLD) {
                showHeader();
                directionAccumRef.current = 0;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isReady]);

    const handleSectionClick = (
        e: ReactMouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        e.preventDefault();
        const targetId = href.replace(/^\/?#/, "");
        const hash = `#${targetId}`;

        if (typeof window !== "undefined" && window.location.pathname === "/") {
            jumpWithTransition(() => {
                const target = document.getElementById(targetId);
                if (!target) {
                    return targetId === "about" ? 0 : null;
                }

                const scrollTarget = target.parentElement?.classList.contains("pin-spacer")
                    ? target.parentElement
                    : target;

                return scrollTarget.getBoundingClientRect().top + window.scrollY;
            }, hash);
        } else {
            transitionRouter.push(href);
        }
    };

    const handleLogoClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
        if (typeof window !== "undefined" && window.location.pathname === "/") {
            e.preventDefault();
            if (window.scrollY > 10) {
                jumpWithTransition(() => 0, "");
            }
        }
    };

    return (
        <header className={styles.header} ref={headerRef}>
            <Link
                href="/"
                onClick={handleLogoClick}
                className={styles.logoLink}
                aria-label="Orbita Home"
            >
                <Logo className={styles.logo} />
            </Link>

            <nav className={styles.navPill} aria-label="Primary Navigation">
                <ul className={styles.navList}>
                    {navItems.map((item) => (
                        <li key={item.href} className={styles.navItem}>
                            {item.isHash ? (
                                <a
                                    href={item.href}
                                    className={styles.navLink}
                                    onClick={(e) => handleSectionClick(e, item.href)}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link href={item.href} className={styles.navLink}>
                                    {item.label}
                                </Link>
                            )}
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
                        aria-label="Language settings"
                        onClick={() => setIsLangOpen((prev) => !prev)}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <g clipPath="url(#globe_clip)">
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
                                <clipPath id="globe_clip">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>

                <div
                    className={`${styles.langDropdown} ${isLangOpen ? styles.langDropdownOpen : ""}`}
                    role="menu"
                    aria-label="Language options"
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            role="menuitem"
                            className={`${styles.langOption} ${
                                selectedLang === lang.label ? styles.langOptionActive : ""
                            }`}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}