"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useCallback, useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const videoSrc = "/video/hero.mp4";

export interface CardProps {
    src: string;
    alt: string;
    title: string;
}

const card: CardProps[] = [
    {
        src: "/images/lamp.jpg",
        alt: "Lamp preview",
        title: "Pre-order now",
    },
];

const leftLines = ["Light", "designed", "as an object"];
const rightLines = ["Light in", "perfect", "balance"];

export const VIDEO_START_DELAY_MS = 750;

interface LandingProps {
    isPortalOpen?: boolean;
}

export default function Landing({ isPortalOpen }: LandingProps = {}) {
    const landingRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const leftLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
    const rightLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
    const cardRef = useRef<HTMLDivElement>(null);
    const scrollDownInnerRef = useRef<HTMLSpanElement>(null);
    const mobileBrandInnerRef = useRef<HTMLSpanElement>(null);

    const [isTriggered, setIsTriggered] = useState(() => Boolean(isPortalOpen));

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const setInitialFrame = () => {
            video.currentTime = 0;
            video.pause();
        };

        if (video.readyState >= 1) {
            setInitialFrame();
        } else {
            video.addEventListener("loadedmetadata", setInitialFrame, { once: true });
        }

        return () => {
            video.removeEventListener("loadedmetadata", setInitialFrame);
        };
    }, []);

    const playVideo = useCallback(() => {
        const video = videoRef.current;
        if (!video || !video.paused) return;

        if (video.currentTime > 0) {
            video.currentTime = 0;
        }

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    }, []);

    useEffect(() => {
        if (isPortalOpen) {
            setIsTriggered(true);
        }
    }, [isPortalOpen]);

    useEffect(() => {
        const handlePortalEvent = () => setIsTriggered(true);
        window.addEventListener("orbita:portal-open", handlePortalEvent);
        return () => window.removeEventListener("orbita:portal-open", handlePortalEvent);
    }, []);

    // Set initial hidden states via GSAP on mount so CSS transforms never conflict
    useGSAP(
        () => {
            const allLines = [
                ...leftLinesRef.current,
                ...rightLinesRef.current,
            ].filter(Boolean);

            gsap.set(allLines, {
                yPercent: 115,
                y: 0,
                opacity: 1,
            });

            if (cardRef.current) {
                gsap.set(cardRef.current, {
                    y: 24,
                    scale: 0.96,
                    opacity: 0,
                });
            }

            const bottomLabels = [
                scrollDownInnerRef.current,
                mobileBrandInnerRef.current,
            ].filter(Boolean);

            gsap.set(bottomLabels, {
                y: 14,
                opacity: 0,
            });
        },
        { scope: landingRef }
    );

    // Trigger split-line text, card, and label reveal synced with video start
    useEffect(() => {
        if (!isTriggered) return;

        const leftEls = leftLinesRef.current.filter(Boolean);
        const rightEls = rightLinesRef.current.filter(Boolean);
        const bottomLabels = [
            scrollDownInnerRef.current,
            mobileBrandInnerRef.current,
        ].filter(Boolean);

        const tl = gsap.timeline({
            delay: VIDEO_START_DELAY_MS / 1000,
            onStart: () => {
                playVideo();
            },
        });

        tl.fromTo(
            leftEls,
            { yPercent: 115, y: 0, opacity: 1 },
            {
                yPercent: 0,
                y: 0,
                opacity: 1,
                duration: 0.85,
                stagger: 0.1,
                ease: "power3.out",
            },
            0
        );

        tl.fromTo(
            rightEls,
            { yPercent: 115, y: 0, opacity: 1 },
            {
                yPercent: 0,
                y: 0,
                opacity: 1,
                duration: 0.85,
                stagger: 0.1,
                ease: "power3.out",
            },
            0.1
        );

        if (cardRef.current) {
            tl.fromTo(
                cardRef.current,
                { y: 24, opacity: 0, scale: 0.96 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "power3.out",
                },
                0.25
            );
        }

        if (bottomLabels.length > 0) {
            tl.fromTo(
                bottomLabels,
                { y: 14, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.06,
                    ease: "power3.out",
                },
                0.3
            );
        }

        return () => {
            tl.kill();
        };
    }, [isTriggered, playVideo]);

    // ScrollTrigger scrub animations on outer wrappers
    useGSAP(
        () => {
            if (!landingRef.current) return;

            const mm = gsap.matchMedia();

            mm.add(
                {
                    isDesktop: "(min-width: 768px)",
                    isMobile: "(max-width: 767px)",
                },
                (context) => {
                    const { isDesktop } = context.conditions!;

                    gsap.to(`.${styles.bg} video`, {
                        yPercent: isDesktop ? 20 : 12,
                        scale: isDesktop ? 1.14 : 1.08,
                        ease: "none",
                        scrollTrigger: {
                            trigger: landingRef.current,
                            start: "top top",
                            end: "bottom top",
                            scrub: true,
                        },
                    });

                    gsap.to(`.${styles.leftHeading}`, {
                        yPercent: isDesktop ? -45 : -30,
                        opacity: 0,
                        filter: "blur(6px)",
                        ease: "none",
                        scrollTrigger: {
                            trigger: landingRef.current,
                            start: "top top",
                            end: "70% top",
                            scrub: true,
                        },
                    });

                    if (isDesktop) {
                        gsap.to(`.${styles.rightHeading}`, {
                            yPercent: -30,
                            opacity: 0,
                            filter: "blur(6px)",
                            ease: "none",
                            scrollTrigger: {
                                trigger: landingRef.current,
                                start: "top top",
                                end: "70% top",
                                scrub: true,
                            },
                        });
                    }

                    gsap.to(`.${styles.cardContainer}`, {
                        yPercent: isDesktop ? -40 : -25,
                        scale: 0.94,
                        opacity: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: landingRef.current,
                            start: "top top",
                            end: "50% top",
                            scrub: true,
                        },
                    });

                    gsap.to([`.${styles.scrollDown}`, `.${styles.mobileBrand}`], {
                        y: -25,
                        opacity: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: landingRef.current,
                            start: "top top",
                            end: "20% top",
                            scrub: true,
                        },
                    });
                }
            );
        },
        { scope: landingRef }
    );

    return (
        <section className={styles.landing} ref={landingRef}>
            <div className={styles.bg}>
                <video
                    ref={videoRef}
                    src={videoSrc}
                    loop
                    muted
                    playsInline
                    preload="auto"
                />
            </div>

            <div className={styles.heroTextOverlay}>
                <h1 className={styles.leftHeading}>
                    {leftLines.map((line, index) => (
                        <span key={index} className={styles.lineMask}>
                            <span
                                ref={(el) => {
                                    leftLinesRef.current[index] = el;
                                }}
                                className={styles.lineInner}
                            >
                                {line}
                            </span>
                        </span>
                    ))}
                </h1>

                <p className={styles.rightHeading}>
                    {rightLines.map((line, index) => (
                        <span key={index} className={styles.lineMask}>
                            <span
                                ref={(el) => {
                                    rightLinesRef.current[index] = el;
                                }}
                                className={styles.lineInner}
                            >
                                {line}
                            </span>
                        </span>
                    ))}
                </p>
            </div>

            <div className={styles.cardContainer}>
                {card.map((item, i) => (
                    <div key={i} ref={cardRef} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                sizes="(max-width: 767px) 56px, 217px"
                                priority
                            />
                        </div>
                        <button type="button" className={styles.cardButton}>
                            {item.title}
                        </button>
                    </div>
                ))}
            </div>

            <span className={styles.scrollDown}>
                <span ref={scrollDownInnerRef} className={styles.scrollDownInner}>
                    Scroll down
                </span>
            </span>

            <span className={styles.mobileBrand}>
                <span ref={mobileBrandInnerRef} className={styles.mobileBrandInner}>
                    Orbita
                </span>
            </span>
        </section>
    );
}