"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

CustomEase.create("gridForm", "0.22, 1, 0.36, 1");
CustomEase.create("sectionTransition", "0.45, 0, 0.25, 1");

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

                    const cardStates = new Map<
                        string,
                        {
                            pill: { left: number; top: number; width: number; height: number };
                            mid: { left: number; top: number; width: number; height: number };
                            final: { left: number; top: number; width: number; height: number };
                        }
                    >();

                    cards.forEach((card) => {
                        const cardEl = el.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
                        const pill = el.querySelector<HTMLElement>(`[data-pill][data-id="${card.id}"]`);
                        const midSlot = el.querySelector<HTMLElement>(`[data-mid-target="${card.id}"]`);
                        const targetSlot = el.querySelector<HTMLElement>(
                            `[data-grid-card="${card.id}"] .${styles.cardImageWrapper}`
                        );

                        if (cardEl && pill && midSlot && targetSlot) {
                            const pillRect = pill.getBoundingClientRect();
                            const midRect = midSlot.getBoundingClientRect();
                            const targetRect = targetSlot.getBoundingClientRect();

                            const pillState = {
                                left: pillRect.left - wrapperRect.left,
                                top: pillRect.top - wrapperRect.top,
                                width: pillRect.width,
                                height: pillRect.height,
                            };

                            const midState = {
                                left: midRect.left - wrapperRect.left,
                                top: midRect.top - wrapperRect.top,
                                width: midRect.width,
                                height: midRect.height,
                            };

                            const finalState = {
                                left: targetRect.left - wrapperRect.left,
                                top: targetRect.top - wrapperRect.top,
                                width: targetRect.width,
                                height: targetRect.height,
                            };

                            cardStates.set(card.id, {
                                pill: pillState,
                                mid: midState,
                                final: finalState,
                            });

                            gsap.set(cardEl, {
                                left: pillState.left,
                                top: pillState.top,
                                width: pillState.width,
                                height: pillState.height,
                                borderRadius: 58,
                                opacity: 0,
                            });
                        }
                    });

                    const tl = gsap.timeline({
                        defaults: { ease: "none" },
                        scrollTrigger: {
                            trigger: textContainer,
                            start: "top top",
                            end: "+=500%",
                            pin: el,
                            pinSpacing: true,
                            scrub: 1.0,
                            anticipatePin: 1,
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

                    const PAUSE_BEFORE_ZOOM = 0.35;
                    const zoomStart = timelineCursor + FADE_DUR + PAUSE_BEFORE_ZOOM;
                    const pills = el.querySelectorAll<HTMLElement>("[data-pill]");
                    const ZOOM_DUR = 4.8;
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
                    const gridStart = zoomEnd + PAUSE_BEFORE_SUCK;
                    const MID_DUR = 2.8;
                    const SUCK_STAGGER = 0.08;

                    tl.to(
                        textContainer,
                        {
                            opacity: 0.35,
                            duration: MID_DUR * 0.7,
                            ease: "power2.inOut",
                        },
                        gridStart
                    );

                    cards.forEach((card, index) => {
                        const cardEl = el.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
                        const pill = el.querySelector<HTMLElement>(`[data-pill][data-id="${card.id}"]`);
                        const pillSvg = pill?.querySelector<SVGElement>("[data-pill-svg]");
                        const states = cardStates.get(card.id);
                        const cardStart = gridStart + index * SUCK_STAGGER;

                        if (cardEl && states) {
                            tl.fromTo(
                                cardEl,
                                { opacity: 0 },
                                {
                                    opacity: 1,
                                    duration: 0.001,
                                    ease: "none",
                                    immediateRender: false,
                                },
                                cardStart
                            );

                            if (pillSvg) {
                                tl.fromTo(
                                    pillSvg,
                                    { opacity: 1 },
                                    {
                                        opacity: 0,
                                        duration: 0.001,
                                        ease: "none",
                                        immediateRender: false,
                                    },
                                    cardStart
                                );
                            }

                            tl.fromTo(
                                cardEl,
                                {
                                    left: states.pill.left,
                                    top: states.pill.top,
                                    width: states.pill.width,
                                    height: states.pill.height,
                                    borderRadius: 58,
                                },
                                {
                                    left: states.mid.left,
                                    top: states.mid.top,
                                    width: states.mid.width,
                                    height: states.mid.height,
                                    borderRadius: 8,
                                    duration: MID_DUR,
                                    ease: "gridForm",
                                    immediateRender: false,
                                },
                                cardStart
                            );
                        }
                    });

                    const midGridEnd = gridStart + (cards.length - 1) * SUCK_STAGGER + MID_DUR;
                    const HOLD_MID_DUR = 0.85;
                    const finalStart = midGridEnd + HOLD_MID_DUR;

                    const FINAL_DUR = 3.2;
                    const FINAL_STAGGER = 0.1;

                    cards.forEach((card, index) => {
                        const cardEl = el.querySelector<HTMLElement>(`[data-card="${card.id}"]`);
                        const states = cardStates.get(card.id);
                        const cardFinalStart = finalStart + index * FINAL_STAGGER;

                        if (cardEl && states) {
                            tl.fromTo(
                                cardEl,
                                {
                                    left: states.mid.left,
                                    top: states.mid.top,
                                    width: states.mid.width,
                                    height: states.mid.height,
                                    borderRadius: 8,
                                },
                                {
                                    left: states.final.left,
                                    top: states.final.top,
                                    width: states.final.width,
                                    height: states.final.height,
                                    borderRadius: 8,
                                    duration: FINAL_DUR,
                                    ease: "sectionTransition",
                                    immediateRender: false,
                                },
                                cardFinalStart
                            );
                        }
                    });

                    tl.to(
                        `.${styles.cardCaption}`,
                        {
                            opacity: 1,
                            y: 0,
                            stagger: 0.08,
                            duration: 0.65,
                            ease: "power2.out",
                        },
                        finalStart + FINAL_DUR * 0.6
                    );

                    const totalEnd = finalStart + (cards.length - 1) * FINAL_STAGGER + FINAL_DUR;
                    tl.to({}, { duration: 0.2 }, totalEnd);
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
                                <span data-split>Meet</span> <Pill id="lamp" />{" "}
                            </span>
                            <span className={styles.line}>
                                <span data-split>Designed to shape the atmosphere </span>
                            </span>
                            <span className={styles.line}>
                                <span data-split>of your space, Orbita Lamp combines </span>
                            </span>
                            <span className={styles.line}>
                                <Pill id="timeless" /> <Pill id="intelligent" />{" "}
                                <span data-split>and </span>
                            </span>
                            <span className={styles.line}>
                                <span data-split>premium </span>
                                <Pill id="craftsmanship" />{" "}
                                <span data-split>to create an </span>
                            </span>
                            <span className={styles.line}>
                                <span data-split>
                                    experience that goes beyond illumination
                                </span>
                            </span>
                        </p>
                    </div>

                    <div className={styles.midGrid} aria-hidden="true">
                        <div className={styles.midSlot} data-mid-target="lamp" />
                        <div className={styles.midSlot} data-mid-target="intelligent" />
                        <div className={styles.midSlot} data-mid-target="timeless" />
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
                        <div
                            key={card.id}
                            className={styles.floatingCard}
                            data-card={card.id}
                        >
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