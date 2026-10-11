"use client";

import { useRef } from "react";
import styles from "./style.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

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

const CHAR_STEP = 0.035;
const FADE_DUR = 0.22;
const DIM_OPACITY = 0.18;

export const gridCards = [
    { id: "lamp", src: "/images/lamp.jpg", alt: "Orbita Lamp minimalist silhouette" },
    { id: "intelligent", src: "/images/lightning.jpg", alt: "Intelligent warm lighting on wood surface" },
    { id: "timeless", src: "/images/timeless.jpg", alt: "Timeless circular brushed metallic form" },
    { id: "craftsmanship", src: "/images/craftmanship.jpg", alt: "Close-up detail of brushed aluminum craftsmanship" },
];

function Pill({ id }: { id: string }) {
    const item = atmosphereImages.find((i) => i.id === id);
    if (!item) return null;

    return (
        <span className={styles.pill} data-pill data-id={id} aria-label={item.alt}>
            <span className={styles.pillGhost} aria-hidden="true">
                {item.title}
            </span>

            <svg
                className={styles.pillSvg}
                data-pill-svg
                aria-hidden="true"
            >
                <defs>
                    <clipPath id={`pill-clip-${id}`}>
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={styles.clipText}
                            data-clip-text
                        >
                            {item.title}
                        </text>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            rx="9999"
                            data-clip-fill
                        />
                    </clipPath>
                </defs>
                <image
                    href={item.src}
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#pill-clip-${id})`}
                />
            </svg>
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

                    const splitTargets = el.querySelectorAll("[data-split]");
                    if (splitTargets.length > 0) {
                        SplitText.create(splitTargets, {
                            type: "words,chars",
                            charsClass: styles.char,
                        });
                    }

                    if (prefersReducedMotion) return;

                    const elRect = el.getBoundingClientRect();

                    // 1. Initial State
                    gsap.set(`.${styles.char}`, { opacity: DIM_OPACITY });
                    gsap.set("[data-pill-svg]", { opacity: DIM_OPACITY });
                    gsap.set("[data-clip-text]", { scale: 1 });
                    gsap.set("[data-clip-fill]", { scale: 0 });
                    gsap.set("[data-pill]", {
                        borderColor: "rgba(26, 26, 26, 0.14)",
                    });
                    gsap.set(`.${styles.textContainer}`, { opacity: 1 });

                    // Initial State for floating cards: align exactly over inline pills
                    gridCards.forEach((card) => {
                        const cardEl = el.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
                        const pill = el.querySelector<HTMLElement>(`[data-pill][data-id="${card.id}"]`);
                        if (cardEl && pill) {
                            const pillRect = pill.getBoundingClientRect();
                            gsap.set(cardEl, {
                                left: pillRect.left - elRect.left,
                                top: pillRect.top - elRect.top,
                                width: pillRect.width,
                                height: pillRect.height,
                                borderRadius: 9999,
                                opacity: 0,
                                boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                            });
                        }
                    });

                    const tl = gsap.timeline({
                        defaults: { ease: "none" },
                        scrollTrigger: {
                            trigger: el,
                            start: "top top",
                            end: "+=360%",
                            pin: true,
                            scrub: 0.9,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    let timelineCursor = 0;
                    const readSequence = el.querySelectorAll<HTMLElement>(
                        `.${styles.char}, [data-pill]`
                    );

                    readSequence.forEach((node) => {
                        if (node.hasAttribute("data-pill")) {
                            const svg = node.querySelector<SVGElement>("[data-pill-svg]");
                            const text = node.querySelector<SVGTextElement>("[data-clip-text]");
                            const charCount = text?.textContent?.length ?? 12;
                            const pillDuration = charCount * CHAR_STEP + FADE_DUR;

                            tl.to(
                                node,
                                {
                                    borderColor: "rgba(26, 26, 26, 0.45)",
                                    duration: pillDuration,
                                },
                                timelineCursor
                            );

                            if (svg) {
                                tl.to(
                                    svg,
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

                    const PAUSE_BEFORE_IMAGE = 0.35;
                    const zoomStart = timelineCursor + FADE_DUR + PAUSE_BEFORE_IMAGE;
                    const pills = el.querySelectorAll<HTMLElement>("[data-pill]");
                    const ZOOM_DUR = 0.9;
                    const STAGGER = 0.22;

                    const pillOrigins: Record<string, string> = {
                        lamp: "56.5% 50%",
                        timeless: "45% 50%",
                        intelligent: "60.5% 50%",
                        craftsmanship: "52% 60%",
                    };

                    pills.forEach((pill, index) => {
                        const id = pill.getAttribute("data-id") || "";
                        const origin = pillOrigins[id] || "50% 50%";
                        const clipText = pill.querySelector<SVGTextElement>("[data-clip-text]");
                        const clipFill = pill.querySelector<SVGRectElement>("[data-clip-fill]");
                        const pillStart = zoomStart + index * STAGGER;

                        if (clipText && clipFill) {
                            tl.fromTo(
                                clipText,
                                { scale: 1, transformOrigin: origin },
                                {
                                    scale: 150,
                                    transformOrigin: origin,
                                    duration: ZOOM_DUR,
                                    ease: "power2.inOut",
                                },
                                pillStart
                            );

                            tl.fromTo(
                                clipFill,
                                { scale: 0, transformOrigin: origin },
                                {
                                    scale: 1,
                                    transformOrigin: origin,
                                    duration: ZOOM_DUR * 0.85,
                                    ease: "power2.inOut",
                                },
                                pillStart + ZOOM_DUR * 0.15
                            );
                        }
                    });

                    const zoomEnd = zoomStart + (pills.length - 1) * STAGGER + ZOOM_DUR;

                    const PAUSE_BEFORE_SUCK = 0.25;
                    const suckStart = zoomEnd + PAUSE_BEFORE_SUCK;
                    const SUCK_DUR = 1.0;
                    const SUCK_STAGGER = 0.08;

                    tl.to(
                        `.${styles.textContainer}`,
                        {
                            opacity: 0.18,
                            duration: SUCK_DUR * 0.7,
                            ease: "power2.inOut",
                        },
                        suckStart
                    );

                    gridCards.forEach((card, index) => {
                        const cardEl = el.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
                        const targetSlot = el.querySelector<HTMLElement>(`[data-target="${card.id}"]`);
                        const pill = el.querySelector<HTMLElement>(`[data-pill][data-id="${card.id}"]`);
                        const pillSvg = pill?.querySelector<SVGElement>("[data-pill-svg]");
                        const cardStart = suckStart + index * SUCK_STAGGER;

                        if (cardEl && targetSlot) {
                            const targetRect = targetSlot.getBoundingClientRect();
                            const endLeft = targetRect.left - elRect.left;
                            const endTop = targetRect.top - elRect.top;
                            const endWidth = targetRect.width;
                            const endHeight = targetRect.height;

                            tl.to(
                                cardEl,
                                {
                                    opacity: 1,
                                    duration: 0.15,
                                    ease: "power1.inOut",
                                },
                                cardStart
                            );

                            if (pillSvg) {
                                tl.to(
                                    pillSvg,
                                    {
                                        opacity: 0,
                                        duration: 0.2,
                                        ease: "power1.inOut",
                                    },
                                    cardStart + 0.04
                                );
                            }

                            tl.to(
                                cardEl,
                                {
                                    left: endLeft,
                                    top: endTop,
                                    width: endWidth,
                                    height: endHeight,
                                    borderRadius: 10,
                                    duration: SUCK_DUR,
                                    ease: "power2.inOut",
                                },
                                cardStart
                            );
                        }
                    });

                    // Phase 4: Hold final 2x2 grid state before unpinning
                    const totalEnd = suckStart + (gridCards.length - 1) * SUCK_STAGGER + SUCK_DUR;
                    const HOLD_DUR = 1.2;
                    tl.to({}, { duration: HOLD_DUR }, totalEnd);
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

            <div className={styles.targetGrid} aria-hidden="true">
                {gridCards.map((card) => (
                    <div key={card.id} className={styles.targetSlot} data-target={card.id} />
                ))}
            </div>

            <div className={styles.cardsOverlay} aria-hidden="true">
                {gridCards.map((card) => (
                    <div key={card.id} className={styles.floatingCard} data-card={card.id}>
                        <Image
                            src={card.src}
                            alt={card.alt}
                            fill
                            sizes="(max-width: 768px) 44vw, (max-width: 1200px) 42vw, 550px"
                            priority
                            className={styles.cardImage}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}