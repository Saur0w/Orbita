"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

export interface cardProps {
    id: string;
    title: string;
    caption: string;
    src: string;
    alt: string;
    bgPosition?: string;
    bgSize?: string;
}

export const cards: cardProps[] = [
    {
        id: "lamp",
        title: "Orbita Lamp",
        caption: "Orbita Lamp",
        src: "/images/lamp.jpg",
        alt: "Orbita Lamp minimalist silhouette",
        bgPosition: "50% 50%",
        bgSize: "cover",
    },
    {
        id: "timeless",
        title: "timeless form,",
        caption: "Timeless Form",
        src: "/images/timeless.jpg",
        alt: "Timeless circular brushed metallic form",
        bgPosition: "62% 48%",
        bgSize: "cover",
    },
    {
        id: "intelligent",
        title: "intelligent lighting,",
        caption: "Intelligent Lighting",
        src: "/images/lightning.jpg",
        alt: "Intelligent warm lighting on wood surface",
        bgPosition: "45% 42%",
        bgSize: "cover",
    },
    {
        id: "craftsmanship",
        title: "craftsmanship",
        caption: "Craftsmanship",
        src: "/images/craftmanship.jpg",
        alt: "Close-up detail of brushed aluminum craftsmanship",
        bgPosition: "50% 50%",
        bgSize: "cover",
    },
];

const CHAR_STEP = 0.035;
const FADE_DUR = 0.22;
const DIM_OPACITY = 0.18;

function Pill({ id }: { id: string }) {
    const item = cards.find((i) => i.id === id);
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
    const desRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const el = desRef.current;
            if (!el) return;

            let ctx: gsap.Context | undefined;
            let isUnmounted = false;

            const buildTimeline = () => {
                if (isUnmounted || !desRef.current) return;
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

                    const contentWrapper = el.querySelector<HTMLElement>(`.${styles.contentWrapper}`);
                    const textContainer = el.querySelector<HTMLElement>(`.${styles.textContainer}`);
                    const gridContainer = el.querySelector<HTMLElement>(`.${styles.gridContainer}`);
                    if (!contentWrapper || !textContainer || !gridContainer) return;

                    const wrapperRect = contentWrapper.getBoundingClientRect();

                    // 1. Initial State
                    gsap.set(`.${styles.char}`, { opacity: DIM_OPACITY });
                    gsap.set("[data-pill-svg]", { opacity: DIM_OPACITY });
                    gsap.set("[data-clip-text]", { scale: 1 });
                    gsap.set("[data-clip-fill]", { scale: 0 });
                    gsap.set("[data-pill]", {
                        borderColor: "rgba(75, 72, 65, 0.15)",
                    });
                    gsap.set(textContainer, { opacity: 1 });
                    gsap.set(`.${styles.cardCaption}`, { opacity: 0, y: 14 });
                    gsap.set(contentWrapper, { y: 0 });

                    // Initial State for floating cards: align exactly over inline pills
                    cards.forEach((card) => {
                        const cardEl = el.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
                        const pill = el.querySelector<HTMLElement>(`[data-pill][data-id="${card.id}"]`);
                        if (cardEl && pill) {
                            const pillRect = pill.getBoundingClientRect();
                            gsap.set(cardEl, {
                                left: pillRect.left - wrapperRect.left,
                                top: pillRect.top - wrapperRect.top,
                                width: pillRect.width,
                                height: pillRect.height,
                                borderRadius: 58,
                                opacity: 0,
                            });
                        }
                    });

                    // 2. Timeline with Pin & Scrub
                    const tl = gsap.timeline({
                        defaults: { ease: "none" },
                        scrollTrigger: {
                            trigger: el,
                            start: "top top",
                            end: "+=460%",
                            pin: true,
                            scrub: 0.9,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    // Phase 1: Text & Pill reveal reading sequence
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
                                    borderColor: "rgba(35, 35, 35, 0.45)",
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

                    // Phase 2: Pill zoom & bloom (Image fills capsule)
                    const PAUSE_BEFORE_ZOOM = 0.35;
                    const zoomStart = timelineCursor + FADE_DUR + PAUSE_BEFORE_ZOOM;
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

                    // Phase 3: Sucked out to form the 2x2 Centered Mid-Grid
                    const PAUSE_BEFORE_SUCK = 0.25;
                    const suckStart = zoomEnd + PAUSE_BEFORE_SUCK;
                    const MID_DUR = 0.95;
                    const SUCK_STAGGER = 0.08;

                    // Text container dims down softly
                    tl.to(
                        textContainer,
                        {
                            opacity: 0.16,
                            duration: MID_DUR * 0.7,
                            ease: "power2.inOut",
                        },
                        suckStart
                    );

                    // Each floating card animates from its inline pill into the 2x2 midGrid slot
                    cards.forEach((card, index) => {
                        const cardEl = el.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
                        const midSlot = el.querySelector<HTMLElement>(`[data-mid-target="${card.id}"]`);
                        const pill = el.querySelector<HTMLElement>(`[data-pill][data-id="${card.id}"]`);
                        const pillSvg = pill?.querySelector<SVGElement>("[data-pill-svg]");
                        const cardStart = suckStart + index * SUCK_STAGGER;

                        if (cardEl && midSlot) {
                            const midRect = midSlot.getBoundingClientRect();
                            const midLeft = midRect.left - wrapperRect.left;
                            const midTop = midRect.top - wrapperRect.top;
                            const midWidth = midRect.width;
                            const midHeight = midRect.height;

                            tl.to(
                                cardEl,
                                {
                                    opacity: 1,
                                    duration: 0.12,
                                    ease: "power1.inOut",
                                },
                                cardStart
                            );

                            if (pillSvg) {
                                tl.to(
                                    pillSvg,
                                    {
                                        opacity: 0,
                                        duration: 0.18,
                                        ease: "power1.inOut",
                                    },
                                    cardStart + 0.04
                                );
                            }

                            tl.to(
                                cardEl,
                                {
                                    left: midLeft,
                                    top: midTop,
                                    width: midWidth,
                                    height: midHeight,
                                    borderRadius: 12,
                                    duration: MID_DUR,
                                    ease: "power2.inOut",
                                },
                                cardStart
                            );
                        }
                    });

                    const midGridEnd = suckStart + (cards.length - 1) * SUCK_STAGGER + MID_DUR;

                    // Hold the 2x2 grid so the user clearly sees this state
                    const HOLD_MID_DUR = 0.85;
                    tl.to({}, { duration: HOLD_MID_DUR }, midGridEnd);

                    // Phase 4: On more scroll, transition down to the Final Editorial Grid
                    const finalStart = midGridEnd + HOLD_MID_DUR;
                    const FINAL_DUR = 1.15;
                    const FINAL_STAGGER = 0.08;

                    // Calculate translation distance so the final grid aligns nicely in view
                    const gridRect = gridContainer.getBoundingClientRect();
                    const availablePadding = Math.max(0, (window.innerHeight - gridRect.height) * 0.2);
                    const scrollDistance = gridRect.top - wrapperRect.top - availablePadding;

                    // Content wrapper glides up to bring the final grid into view
                    tl.to(
                        contentWrapper,
                        {
                            y: -Math.max(0, scrollDistance),
                            duration: FINAL_DUR * 1.05,
                            ease: "power2.inOut",
                        },
                        finalStart
                    );

                    tl.to(
                        textContainer,
                        {
                            opacity: 0.06,
                            duration: FINAL_DUR * 0.6,
                            ease: "power2.inOut",
                        },
                        finalStart
                    );

                    // Cards fly from the 2x2 mid-grid into the final destination cards
                    cards.forEach((card, index) => {
                        const cardEl = el.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
                        const targetSlot = el.querySelector<HTMLElement>(`[data-grid-card="${card.id}"] .${styles.cardImageWrapper}`);
                        const cardFinalStart = finalStart + index * FINAL_STAGGER;

                        if (cardEl && targetSlot) {
                            const targetRect = targetSlot.getBoundingClientRect();
                            const endLeft = targetRect.left - wrapperRect.left;
                            const endTop = targetRect.top - wrapperRect.top;
                            const endWidth = targetRect.width;
                            const endHeight = targetRect.height;

                            tl.to(
                                cardEl,
                                {
                                    left: endLeft,
                                    top: endTop,
                                    width: endWidth,
                                    height: endHeight,
                                    borderRadius: 12,
                                    duration: FINAL_DUR,
                                    ease: "power2.inOut",
                                },
                                cardFinalStart
                            );
                        }
                    });

                    // Reveal card captions under the final grid cards
                    tl.to(
                        `.${styles.cardCaption}`,
                        {
                            opacity: 1,
                            y: 0,
                            stagger: 0.08,
                            duration: 0.45,
                            ease: "power2.out",
                        },
                        finalStart + FINAL_DUR * 0.65
                    );

                    // Phase 5: Hold final layout before unpinning
                    const totalEnd = finalStart + (cards.length - 1) * FINAL_STAGGER + FINAL_DUR;
                    const HOLD_FINAL_DUR = 1.0;
                    tl.to({}, { duration: HOLD_FINAL_DUR }, totalEnd);
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
        { scope: desRef }
    );

    return (
        <section className={styles.des} ref={desRef}>
            <div className={styles.contentWrapper}>
                <section className={styles.textContainer}>
                    <div className={styles.text}>
                        <p className={styles.statement}>
                            <span className={styles.line}>
                                <span data-split>Meet</span> <Pill id="lamp" />
                            </span>
                            <span className={styles.line}>
                                <span data-split>Designed to shape the atmosphere</span>
                            </span>
                            <span className={styles.line}>
                                <span data-split>of your space, Orbita Lamp combines</span>
                            </span>
                            <span className={styles.line}>
                                <Pill id="timeless" /> <Pill id="intelligent" />{" "}
                                <span data-split>and</span>
                            </span>
                            <span className={styles.line}>
                                <span data-split>premium</span> <Pill id="craftsmanship" />{" "}
                                <span data-split>to create an</span>
                            </span>
                            <span className={styles.line}>
                                <span data-split>experience that goes beyond illumination</span>
                            </span>
                        </p>
                    </div>

                    {/* 2x2 Mid-State Grid Guide (Image 3) */}
                    <div className={styles.midGrid} aria-hidden="true">
                        <div className={styles.midSlot} data-mid-target="timeless" />
                        <div className={styles.midSlot} data-mid-target="intelligent" />
                        <div className={styles.midSlot} data-mid-target="lamp" />
                        <div className={styles.midSlot} data-mid-target="craftsmanship" />
                    </div>
                </section>

                <section className={styles.gridContainer}>
                    <div className={styles.grid}>
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                className={`${styles.card} ${styles[card.id]}`}
                                data-grid-card={card.id}
                            >
                                <div className={styles.cardImageWrapper} />
                                <span className={styles.cardCaption}>{card.caption}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className={styles.cardsOverlay} aria-hidden="true">
                    {cards.map((card) => (
                        <div key={card.id} className={styles.floatingCard} data-card={card.id}>
                            <Image
                                src={card.src}
                                alt={card.alt}
                                fill
                                priority
                                sizes="(max-width: 768px) 90vw, 55vw"
                                className={styles.cardImage}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}