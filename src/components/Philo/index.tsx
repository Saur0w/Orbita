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

    useGSAP(
        (_, contextSafe) => {
            if (!contextSafe) return;

            let isCancelled = false;
            let headerTitleSplit: SplitText | null = null;
            let titleTween: gsap.core.Tween | null = null;

            const initSplitText = contextSafe(() => {
                if (isCancelled || !titleRef.current) return;

                titleTween?.scrollTrigger?.kill();
                titleTween?.kill();
                headerTitleSplit?.revert();

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
                        { yPercent: -6, scale: 1.1 },
                        {
                            yPercent: 6,
                            scale: 1,
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
                    priority
                    className={styles.bannerImage}
                />

                <div className={styles.contentOverlay}>
                    <div ref={infoCardRef} className={styles.infoCard}>
                        <h3 className={styles.infoHeading}>
                            {t("infoHeading.line1")}
                            <br />
                            {t("infoHeading.line2")}
                            <br />
                            {t("infoHeading.line3")}
                        </h3>

                        <div className={styles.elementsList}>
                            {ELEMENT_KEYS.map((key) => (
                                <span key={key}>{t(`elements.${key}`)}</span>
                            ))}
                        </div>

                        <p className={styles.infoDesc}>{t("infoDesc")}</p>

                        <Link href="/preorder" className={styles.pillButton}>
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