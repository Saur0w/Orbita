"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import styles from "./style.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const ELEMENT_KEYS = ["circle", "axis", "cylinder"] as const;

export default function Philo() {
    const t = useTranslations("Philo");
    const locale = useLocale();

    const philoRef = useRef<HTMLElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const tagRef = useRef<HTMLSpanElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const imageSectionRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const infoCardRef = useRef<HTMLDivElement | null>(null);
    const infoHeadingRef = useRef<HTMLHeadingElement | null>(null);
    const elementsListRef = useRef<HTMLDivElement | null>(null);
    const infoDescRef = useRef<HTMLParagraphElement | null>(null);
    const ctaRef = useRef<HTMLAnchorElement | null>(null);

    useGSAP(
        (_, contextSafe) => {
            if (!contextSafe) return;

            let isCancelled = false;
            let headerTitleSplit: SplitText | null = null;
            let infoHeadingSplit: SplitText | null = null;
            let titleTween: gsap.core.Tween | null = null;
            let infoTimeline: gsap.core.Timeline | null = null;

            const initSplitText = contextSafe(() => {
                if (isCancelled) return;

                titleTween?.scrollTrigger?.kill();
                titleTween?.kill();
                headerTitleSplit?.revert();

                infoTimeline?.scrollTrigger?.kill();
                infoTimeline?.kill();
                infoHeadingSplit?.revert();

                if (titleRef.current) {
                    headerTitleSplit = new SplitText(titleRef.current, {
                        type: "lines",
                        mask: "lines",
                        linesClass: `${styles.splitLine} splitLine`,
                    });

                    titleTween = gsap.from(headerTitleSplit.lines, {
                        yPercent: 120,
                        duration: 1.15,
                        stagger: 0.12,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: titleRef.current,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                    });
                }

                if (infoHeadingRef.current && imageSectionRef.current) {
                    infoHeadingSplit = new SplitText(infoHeadingRef.current, {
                        type: "lines",
                        mask: "lines",
                        linesClass: `${styles.splitLine} splitLine`,
                    });

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: imageSectionRef.current,
                            start: "top 72%",
                            toggleActions: "play none none reverse",
                        },
                    });

                    tl.from(infoHeadingSplit.lines, {
                        yPercent: 115,
                        opacity: 0,
                        duration: 1.0,
                        stagger: 0.1,
                        ease: "power4.out",
                    });

                    if (elementsListRef.current?.children.length) {
                        tl.from(
                            elementsListRef.current.children,
                            {
                                y: 16,
                                opacity: 0,
                                duration: 0.7,
                                stagger: 0.08,
                                ease: "power3.out",
                            },
                            "-=0.65"
                        );
                    }

                    if (infoDescRef.current) {
                        tl.from(
                            infoDescRef.current,
                            {
                                y: 18,
                                opacity: 0,
                                duration: 0.8,
                                ease: "power3.out",
                            },
                            "-=0.55"
                        );
                    }

                    if (ctaRef.current) {
                        tl.from(
                            ctaRef.current,
                            {
                                y: 16,
                                opacity: 0,
                                duration: 0.75,
                                ease: "power3.out",
                            },
                            "-=0.55"
                        );
                    }

                    infoTimeline = tl;
                }
            });

            initSplitText();

            if (tagRef.current) {
                gsap.from(tagRef.current, {
                    y: 24,
                    opacity: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: tagRef.current,
                        start: "top 88%",
                        toggleActions: "play none none reverse",
                    },
                });
            }

            const mm = gsap.matchMedia();

            mm.add("(min-width: 769px)", () => {
                if (imageRef.current) {
                    gsap.fromTo(
                        imageRef.current,
                        { yPercent: -2.8, scale: 1.08 },
                        {
                            yPercent: 2.8,
                            scale: 1.06,
                            ease: "none",
                            scrollTrigger: {
                                trigger: imageSectionRef.current,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1.2,
                            },
                        }
                    );
                }

                if (infoCardRef.current) {
                    gsap.fromTo(
                        infoCardRef.current,
                        { y: 30 },
                        {
                            y: -30,
                            ease: "none",
                            scrollTrigger: {
                                trigger: imageSectionRef.current,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1,
                            },
                        }
                    );
                }
            });

            ScrollTrigger.sort();
            ScrollTrigger.refresh();

            if (typeof document !== "undefined" && document.fonts?.status !== "loaded") {
                void document.fonts.ready.then(() => {
                    if (isCancelled) return;
                    initSplitText();
                    ScrollTrigger.sort();
                    ScrollTrigger.refresh();
                });
            }

            return () => {
                isCancelled = true;
                titleTween?.scrollTrigger?.kill();
                titleTween?.kill();
                headerTitleSplit?.revert();
                infoTimeline?.scrollTrigger?.kill();
                infoTimeline?.kill();
                infoHeadingSplit?.revert();
                mm.revert();
            };
        },
        { scope: philoRef, dependencies: [locale], revertOnUpdate: true }
    );

    return (
        <section ref={philoRef} className={styles.philo}>
            <div ref={headerRef} className={styles.upperSection}>
        <span ref={tagRef} className={styles.tag}>
          {t("tag")}
        </span>
                <h2 ref={titleRef} className={styles.title} key={locale}>
                    <span>{t("title.line1")}</span>
                    <span>{t("title.line2")}</span>
                    <span>{t("title.line3")}</span>
                </h2>
            </div>

            <div ref={imageSectionRef} className={styles.imageSection}>
                <Image
                    ref={imageRef}
                    src="/images/philo.png"
                    alt={t("imageAlt")}
                    fill
                    sizes="100vw"
                    loading="eager"
                    className={styles.bannerImage}
                />

                <div className={styles.contentOverlay}>
                    <div ref={infoCardRef} className={styles.infoCard}>
                        <h3 ref={infoHeadingRef} className={styles.infoHeading}>
                            {t("infoHeading.line1")}
                            <br />
                            {t("infoHeading.line2")}
                            <br />
                            {t("infoHeading.line3")}
                        </h3>

                        <div ref={elementsListRef} className={styles.elementsList}>
                            {ELEMENT_KEYS.map((key) => (
                                <span key={key}>{t(`elements.${key}`)}</span>
                            ))}
                        </div>

                        <p ref={infoDescRef} className={styles.infoDesc}>{t("infoDesc")}</p>

                        <Link ref={ctaRef} href="/preorder" className={styles.pillButton}>
                            <span className={styles.buttonText}>{t("cta")}</span>
                            <span className={styles.arrowCircle}>
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                  <path
                      d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5"
                      stroke="#232323"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  />
                </svg>
              </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}