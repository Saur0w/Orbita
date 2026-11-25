"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import styles from "./style.module.scss";
import { Logo } from "../Icons/logo";
import Magnetic from "@/ui/Magnetic";
import FooterImage from "../../../public/images/footer.png";
import PerspectiveText from "@/ui/PerspectiveText";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
    CustomEase.create("luxuryMask", "0.16, 1, 0.3, 1");
}

type LenisLike = {
    scrollTo: (
        target: string | number | HTMLElement,
        options?: { immediate?: boolean; force?: boolean }
    ) => void;
};

type DocumentWithTransition = Document & {
    startViewTransition?: (callback: () => void) => unknown;
};

const NAV_LINKS = [
    { key: "about", href: "#about" },
    { key: "theLamp", href: "#the-lamp" },
    { key: "features", href: "#features" },
    { key: "specification", href: "#specification" },
] as const;

const SOCIAL_LINKS = [
    { key: "instagram", href: "https://instagram.com" },
    { key: "x", href: "https://x.com" },
    { key: "pinterest", href: "https://pinterest.com" },
] as const;

const CREDITS = {
    designer: { label: "Designed by", name: "Qoreeb", href: "https://x.com/QoreebA" },
    developer: { label: "Developed by", name: "Saurow", href: "https://x.com/sauroww" },
} as const;

export default function Footer() {
    const t = useTranslations("Footer");
    const locale = useLocale();

    const footerRef = useRef<HTMLElement | null>(null);
    const topBorderRef = useRef<HTMLDivElement | null>(null);
    const logoRef = useRef<HTMLDivElement | null>(null);
    const emailLabelRef = useRef<HTMLSpanElement | null>(null);
    const emailTextRef = useRef<HTMLSpanElement | null>(null);
    const navLabelRef = useRef<HTMLSpanElement | null>(null);
    const navLinksRef = useRef<(HTMLSpanElement | null)[]>([]);
    const socialsLabelRef = useRef<HTMLSpanElement | null>(null);
    const socialLinksRef = useRef<(HTMLSpanElement | null)[]>([]);
    const imageSectionRef = useRef<HTMLDivElement | null>(null);
    const bannerWrapperRef = useRef<HTMLDivElement | null>(null);
    const cardParallaxRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const creditsRef = useRef<HTMLDivElement | null>(null);

    const getLenis = (): LenisLike | undefined => {
        if (typeof window === "undefined") return undefined;
        return (window as unknown as { lenis?: LenisLike }).lenis;
    };

    const jumpWithTransition = (getTop: () => number | null, hash?: string) => {
        const performJump = () => {
            const top = getTop();
            if (top === null) return;

            const lenis = getLenis();
            if (lenis) {
                lenis.scrollTo(top, { immediate: true, force: true });
            } else {
                window.scrollTo(0, top);
            }

            ScrollTrigger.update();

            if (hash !== undefined) {
                window.history.replaceState(null, "", hash || window.location.pathname);
            }
        };

        const doc = document as DocumentWithTransition;
        if (doc.startViewTransition) {
            doc.startViewTransition(performJump);
        } else {
            performJump();
        }
    };

    const handleSectionScroll = (
        e: MouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        e.preventDefault();

        jumpWithTransition(() => {
            const target = document.querySelector<HTMLElement>(href);
            if (!target) {
                return href === "#about" ? 0 : null;
            }

            const scrollTarget = target.parentElement?.classList.contains("pin-spacer")
                ? target.parentElement
                : target;

            return scrollTarget.getBoundingClientRect().top + window.scrollY;
        }, href);
    };

    const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (typeof window !== "undefined" && window.location.pathname === "/") {
            e.preventDefault();
            jumpWithTransition(() => 0, "");
        }
    };

    useGSAP(
        (_, contextSafe) => {
            if (!contextSafe) return;

            let isCancelled = false;
            let labelSplit: SplitText | null = null;
            let revealTimeline: gsap.core.Timeline | null = null;

            const initSplitText = contextSafe(() => {
                if (isCancelled) return;

                revealTimeline?.scrollTrigger?.kill();
                revealTimeline?.kill();
                labelSplit?.revert();

                const labelElements = [
                    emailLabelRef.current,
                    navLabelRef.current,
                    socialsLabelRef.current,
                ].filter(Boolean) as HTMLElement[];

                if (labelElements.length > 0) {
                    labelSplit = new SplitText(labelElements, {
                        type: "lines",
                        mask: "lines",
                        linesClass: `${styles.splitLine} splitLine`,
                    });
                }

                const linkElements = [
                    ...navLinksRef.current,
                    ...socialLinksRef.current,
                ].filter(Boolean) as HTMLElement[];

                revealTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                });

                if (topBorderRef.current) {
                    revealTimeline.fromTo(
                        topBorderRef.current,
                        { scaleX: 0 },
                        {
                            scaleX: 1,
                            duration: 1.6,
                            ease: "power3.inOut",
                            transformOrigin: "left center",
                        },
                        0
                    );
                }

                if (logoRef.current) {
                    revealTimeline.fromTo(
                        logoRef.current,
                        { opacity: 0, y: 16 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1.2,
                            ease: "power2.out",
                            clearProps: "opacity,transform",
                        },
                        0.15
                    );
                }

                if (labelSplit && labelSplit.lines.length > 0) {
                    revealTimeline.from(
                        labelSplit.lines,
                        {
                            yPercent: 115,
                            opacity: 0,
                            duration: 1.35,
                            stagger: 0.09,
                            ease: "luxuryMask",
                        },
                        0.15
                    );
                }

                if (emailTextRef.current) {
                    revealTimeline.fromTo(
                        emailTextRef.current,
                        { yPercent: 130 },
                        {
                            yPercent: 0,
                            duration: 1.65,
                            ease: "luxuryMask",
                        },
                        0.25
                    );
                }

                if (linkElements.length > 0) {
                    revealTimeline.fromTo(
                        linkElements,
                        { yPercent: 130 },
                        {
                            yPercent: 0,
                            duration: 1.45,
                            stagger: 0.065,
                            ease: "luxuryMask",
                        },
                        0.32
                    );
                }
            });

            initSplitText();

            if (cardRef.current && imageSectionRef.current) {
                gsap.from(cardRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 1.4,
                    ease: "luxuryMask",
                    scrollTrigger: {
                        trigger: imageSectionRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                });
            }

            if (creditsRef.current && imageSectionRef.current) {
                gsap.from(creditsRef.current, {
                    opacity: 0,
                    y: 8,
                    duration: 1.1,
                    delay: 0.25,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: imageSectionRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                });
            }

            const mm = gsap.matchMedia();

            mm.add("(min-width: 769px)", () => {
                if (bannerWrapperRef.current && footerRef.current) {
                    gsap.fromTo(
                        bannerWrapperRef.current,
                        { yPercent: -5 },
                        {
                            yPercent: 5,
                            ease: "none",
                            scrollTrigger: {
                                trigger: footerRef.current,
                                start: "top bottom",
                                end: "bottom bottom",
                                scrub: 1.2,
                            },
                        }
                    );
                }

                if (cardParallaxRef.current && footerRef.current) {
                    gsap.fromTo(
                        cardParallaxRef.current,
                        { y: 26 },
                        {
                            y: -26,
                            ease: "none",
                            scrollTrigger: {
                                trigger: footerRef.current,
                                start: "top bottom",
                                end: "bottom bottom",
                                scrub: 0.9,
                            },
                        }
                    );
                }
            });

            mm.add("(max-width: 768px)", () => {
                if (bannerWrapperRef.current && footerRef.current) {
                    gsap.fromTo(
                        bannerWrapperRef.current,
                        { yPercent: -2.5 },
                        {
                            yPercent: 2.5,
                            ease: "none",
                            scrollTrigger: {
                                trigger: footerRef.current,
                                start: "top bottom",
                                end: "bottom bottom",
                                scrub: 1,
                            },
                        }
                    );
                }

                if (cardParallaxRef.current && footerRef.current) {
                    gsap.fromTo(
                        cardParallaxRef.current,
                        { y: 12 },
                        {
                            y: -12,
                            ease: "none",
                            scrollTrigger: {
                                trigger: footerRef.current,
                                start: "top bottom",
                                end: "bottom bottom",
                                scrub: 0.8,
                            },
                        }
                    );
                }
            });

            if (typeof document !== "undefined" && document.fonts?.status !== "loaded") {
                void document.fonts.ready.then(() => {
                    if (isCancelled) return;
                    initSplitText();
                    ScrollTrigger.refresh();
                });
            }

            return () => {
                isCancelled = true;
                revealTimeline?.scrollTrigger?.kill();
                revealTimeline?.kill();
                labelSplit?.revert();
                mm.revert();
            };
        },
        { scope: footerRef, dependencies: [locale], revertOnUpdate: true }
    );

    return (
        <footer ref={footerRef} className={styles.footer}>
            <div className={styles.topBorderWrapper}>
                <div ref={topBorderRef} className={styles.topBorder} />
            </div>

            <div className={styles.topSection} key={locale}>
                <div ref={logoRef} className={styles.logoCol}>
                    <Link
                        href="/"
                        onClick={handleLogoClick}
                        aria-label={t("homeAriaLabel")}
                        className={styles.logoLink}
                    >
                        <Logo className={styles.logo} />
                    </Link>
                </div>

                <div className={styles.emailCol}>
                    <span ref={emailLabelRef} className={styles.columnLabel}>
                        {t("labels.email")}
                    </span>
                    <Magnetic>
                        <a
                            href={`mailto:${t("email")}`}
                            className={styles.emailLink}
                            data-perspective-trigger
                        >
                            <span className={styles.linkRevealMask}>
                                <span ref={emailTextRef} className={styles.emailText}>
                                    <PerspectiveText label={t("email")} />
                                </span>
                            </span>
                        </a>
                    </Magnetic>
                </div>

                <div className={styles.navCol}>
                    <span ref={navLabelRef} className={styles.columnLabel}>
                        {t("labels.navs")}
                    </span>
                    <ul className={styles.linkList}>
                        {NAV_LINKS.map((link, idx) => (
                            <li key={link.key}>
                                <a
                                    href={link.href}
                                    onClick={(e) => handleSectionScroll(e, link.href)}
                                    className={styles.linkItem}
                                    data-perspective-trigger
                                >
                                    <span className={styles.linkRevealMask}>
                                        <span
                                            ref={(el) => {
                                                navLinksRef.current[idx] = el;
                                            }}
                                            className={styles.linkText}
                                        >
                                            <PerspectiveText label={t(`nav.${link.key}`)} />
                                        </span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.socialsCol}>
                    <span ref={socialsLabelRef} className={styles.columnLabel}>
                        {t("labels.socials")}
                    </span>
                    <ul className={styles.linkList}>
                        {SOCIAL_LINKS.map((link, idx) => (
                            <li key={link.key}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.linkItem}
                                    data-perspective-trigger
                                >
                                    <span className={styles.linkRevealMask}>
                                        <span
                                            ref={(el) => {
                                                socialLinksRef.current[idx] = el;
                                            }}
                                            className={styles.linkText}
                                        >
                                            <PerspectiveText label={t(`socials.${link.key}`)} />
                                        </span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div ref={imageSectionRef} className={styles.imageSection}>
                <div ref={bannerWrapperRef} className={styles.bannerWrapper}>
                    <Image
                        src={FooterImage}
                        alt={t("bannerAlt")}
                        fill
                        sizes="100vw"
                        priority
                        className={styles.bannerImage}
                        unoptimized
                    />
                </div>

                <div className={styles.centerCard}>
                    <div ref={cardParallaxRef} className={styles.cardParallax}>
                        <div ref={cardRef} className={styles.card}>
                            <div className={styles.cardImageWrapper}>
                                <Image
                                    src="/images/lamp.jpg"
                                    alt={t("cardAlt")}
                                    fill
                                    sizes="252px"
                                    priority
                                    className={styles.cardImage}
                                />
                            </div>

                            <Link
                                href="/preorder"
                                className={styles.cardButton}
                                data-perspective-trigger
                            >
                                <PerspectiveText label={t("cta")} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div ref={creditsRef} className={styles.creditsBar}>
                    <span className={styles.creditItem}>
                        <span>{CREDITS.designer.label}</span>
                        <a
                            href={CREDITS.designer.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.creditLink}
                            data-perspective-trigger
                        >
                            <PerspectiveText label={CREDITS.designer.name} />
                        </a>
                    </span>

                    <span className={styles.creditDivider} aria-hidden="true">
                        ·
                    </span>

                    <span className={styles.creditItem}>
                        <span>{CREDITS.developer.label}</span>
                        <a
                            href={CREDITS.developer.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.creditLink}
                            data-perspective-trigger
                        >
                            <PerspectiveText label={CREDITS.developer.name} />
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}