"use client";

import { useRef, type CSSProperties } from "react";
import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export interface AtmosphereImage {
    id: string;
    title: string;
    src: string;
    alt: string;
    bgPosition?: string;
    bgSize?: string;
}

export const atmosphereImages: AtmosphereImage[] = [
    {
        id: "lamp",
        title: "Orbita Lamp",
        src: "/images/lamp.jpg",
        alt: "Orbita Lamp minimalist silhouette",
        bgPosition: "50% 50%",
        bgSize: "cover",
    },
    {
        id: "timeless",
        title: "timeless form,",
        src: "/images/timeless.jpg",
        alt: "Timeless circular brushed metallic form",
        bgPosition: "62% 48%",
        bgSize: "cover",
    },
    {
        id: "intelligent",
        title: "intelligent lighting,",
        src: "/images/lightning.jpg",
        alt: "Intelligent warm lighting on wood surface",
        bgPosition: "45% 42%",
        bgSize: "cover",
    },
    {
        id: "craftsmanship",
        title: "craftsmanship",
        src: "/images/craftmanship.jpg",
        alt: "Close-up detail of brushed aluminum craftsmanship",
        bgPosition: "50% 50%",
        bgSize: "cover",
    },
];

const CHAR_STEP = 0.035; // Scrub time per character
const FADE_DUR = 0.22;   // Character illumination duration
const DIM_OPACITY = 0.18; // Initial dim state

function Pill({ id }: { id: string }) {
    const item = atmosphereImages.find((i) => i.id === id);
    if (!item) return null;

    const style = {
        "--img": `url(${item.src})`,
        "--pos": item.bgPosition || "center center",
        "--size": item.bgSize || "cover",
    } as CSSProperties;

    return (
        <span className={styles.pill} data-pill aria-label={item.alt}>
            {/* Absolute image container locked within capsule boundaries */}
            <span className={styles.pillMedia} data-pill-media>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={item.src}
                    alt={item.alt}
                    className={styles.pillImg}
                    data-pill-img
                    style={{ objectPosition: item.bgPosition || "center center" }}
                />
            </span>

            {/* Text label with photographic background-clip fill that establishes static pill dimensions */}
            <span className={styles.pillLabel} data-pill-label style={style}>
                {item.title}
            </span>
        </span>
    );
}

export default function Des() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const el = containerRef.current;
            if (!el) return;

            let ctx: gsap.Context | undefined;
            let isUnmounted = false;

            const buildTimeline = () => {
                if (isUnmounted || !containerRef.current) return;
                ctx?.revert();

                ctx = gsap.context(() => {
                    const prefersReducedMotion = window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches;

                    // Split only plain text elements, protecting .pill from being modified
                    const splitTargets = el.querySelectorAll("[data-split]");
                    if (splitTargets.length > 0) {
                        SplitText.create(splitTargets, {
                            type: "words,chars",
                            charsClass: styles.char,
                        });
                    }

                    if (prefersReducedMotion) return;

                    // 1. Initial State
                    gsap.set(`.${styles.char}`, { opacity: DIM_OPACITY });
                    gsap.set(`.${styles.pillLabel}`, { opacity: DIM_OPACITY, scale: 1 });
                    gsap.set(`.${styles.pillMedia}`, { opacity: 0 });
                    gsap.set("[data-pill]", {
                        borderColor: "rgba(26, 26, 26, 0.14)",
                    });

                    // 2. Main Scrubbed Timeline
                    const tl = gsap.timeline({
                        defaults: { ease: "none" },
                        scrollTrigger: {
                            trigger: el,
                            start: "top top",
                            end: "+=240%",
                            pin: true,
                            scrub: 0.9,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    // Phase 1: Progressive character & pill reading illumination
                    let timelineCursor = 0;
                    const readSequence = el.querySelectorAll<HTMLElement>(
                        `.${styles.char}, [data-pill]`
                    );

                    readSequence.forEach((node) => {
                        if (node.hasAttribute("data-pill")) {
                            const label = node.querySelector<HTMLElement>("[data-pill-label]");
                            const charCount = label?.textContent?.length ?? 12;
                            const pillDuration = charCount * CHAR_STEP + FADE_DUR;

                            // Crisp pill border formation
                            tl.to(
                                node,
                                {
                                    borderColor: "rgba(26, 26, 26, 0.45)",
                                    duration: pillDuration,
                                },
                                timelineCursor
                            );

                            // Illuminate photographic text fill
                            if (label) {
                                tl.to(
                                    label,
                                    {
                                        opacity: 1,
                                        duration: pillDuration,
                                    },
                                    timelineCursor
                                );
                            }

                            timelineCursor += charCount * CHAR_STEP;
                        } else {
                            tl.to(
                                node,
                                {
                                    opacity: 1,
                                    duration: FADE_DUR,
                                },
                                timelineCursor
                            );
                            timelineCursor += CHAR_STEP;
                        }
                    });

                    // Phase 2: Pill Font Zoom to Reveal Image (static capsule footprint)
                    const PAUSE_BEFORE_IMAGE = 0.35;
                    const zoomStart = timelineCursor + FADE_DUR + PAUSE_BEFORE_IMAGE;
                    const pills = el.querySelectorAll<HTMLElement>("[data-pill]");
                    const ZOOM_DUR = 0.85;
                    const STAGGER = 0.22;

                    pills.forEach((pill, index) => {
                        const media = pill.querySelector<HTMLElement>("[data-pill-media]");
                        const label = pill.querySelector<HTMLElement>("[data-pill-label]");
                        const pillStart = zoomStart + index * STAGGER;

                        // 1. Scale font inside capsule massively (image expands through letter cutouts)
                        if (label) {
                            tl.fromTo(
                                label,
                                { scale: 1 },
                                {
                                    scale: 18,
                                    duration: ZOOM_DUR,
                                    ease: "power2.in",
                                },
                                pillStart
                            );

                            // Fade out text label as letters explode past the capsule boundaries
                            tl.to(
                                label,
                                {
                                    opacity: 0,
                                    duration: ZOOM_DUR * 0.35,
                                    ease: "power1.in",
                                },
                                pillStart + ZOOM_DUR * 0.65
                            );
                        }

                        // 2. Full photographic fill seamlessly takes over the capsule
                        if (media) {
                            tl.fromTo(
                                media,
                                { opacity: 0 },
                                {
                                    opacity: 1,
                                    duration: ZOOM_DUR * 0.45,
                                    ease: "power2.out",
                                },
                                pillStart + ZOOM_DUR * 0.55
                            );
                        }
                    });

                    // Hold final state before unpinning so all full pill images remain visible
                    const totalEnd = zoomStart + (pills.length - 1) * STAGGER + ZOOM_DUR;
                    tl.to({}, { duration: 0.9 }, totalEnd);
                }, el);

                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            };

            buildTimeline();

            if (document.fonts?.ready) {
                document.fonts.ready.then(() => {
                    if (!isUnmounted) buildTimeline();
                });
            }

            let resizeTimer: number;
            const onResize = () => {
                clearTimeout(resizeTimer);
                resizeTimer = window.setTimeout(() => {
                    if (!isUnmounted) buildTimeline();
                }, 200);
            };
            window.addEventListener("resize", onResize);

            return () => {
                isUnmounted = true;
                clearTimeout(resizeTimer);
                window.removeEventListener("resize", onResize);
                ctx?.revert();
            };
        },
        { scope: containerRef }
    );

    return (
        <section className={styles.des} ref={containerRef}>
            <div className={styles.textContainer}>
                <p className={styles.statement}>
                    <span data-split>Meet</span> <Pill id="lamp" />
                    <br className={styles.desktopBr} />
                    <span data-split>Designed to shape the atmosphere</span>
                    <br className={styles.desktopBr} />
                    <span data-split>of your space, Orbita Lamp combines</span>
                    <br className={styles.desktopBr} />
                    <Pill id="timeless" /> <Pill id="intelligent" />{" "}
                    <span data-split>and</span>
                    <br className={styles.desktopBr} />
                    <span data-split>premium</span> <Pill id="craftsmanship" />{" "}
                    <span data-split>to create an</span>
                    <br className={styles.desktopBr} />
                    <span data-split>experience that goes beyond illumination</span>
                </p>
            </div>
        </section>
    );
}