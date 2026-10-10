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
        src: "/images/timeless.jpg",
        alt: "Orbita Lamp circular brushed metallic form",
        bgPosition: "62% 48%",
        bgSize: "cover",
    },
    {
        id: "timeless",
        title: "timeless form,",
        src: "/images/lamp.jpg",
        alt: "Timeless brushed metallic lamp silhouette",
        bgPosition: "50% 46%",
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

const STEP = 0.03; // timeline time per character
const FADE = 0.2; // time one character takes to go from dim to full
const DIM = 0.22; // starting opacity of unread text

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                className={styles.pillImage}
                src={item.src}
                alt={item.alt}
                data-pill-img
            />
            <span className={styles.label} data-label style={style}>
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
            let dead = false;

            const build = () => {
                if (dead || !containerRef.current) return;
                ctx?.revert();

                ctx = gsap.context(() => {
                    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

                    const splitTargets = el.querySelectorAll("[data-split]");
                    if (splitTargets.length > 0) {
                        SplitText.create(splitTargets, {
                            type: "words,chars",
                            charsClass: styles.char,
                        });
                    }

                    gsap.set(`.${styles.statement}`, { opacity: 1 });
                    if (reduce) return;

                    gsap.set(`.${styles.char}`, { opacity: DIM });
                    gsap.set(`.${styles.label}`, { "--mask-pos": "-18%" });
                    gsap.set("[data-pill]", { "--b": 0 });
                    gsap.set("[data-pill-img]", { opacity: 0 });

                    const tl = gsap.timeline({
                        defaults: { ease: "none" },
                        scrollTrigger: {
                            trigger: el,
                            start: "top top",
                            end: "+=250%",
                            pin: true,
                            scrub: 0.8,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    let t = 0;
                    el.querySelectorAll<HTMLElement>(`.${styles.char}, [data-pill]`).forEach((node) => {
                        if (node.hasAttribute("data-pill")) {
                            const label = node.querySelector<HTMLElement>("[data-label]");
                            const span = (label?.textContent?.length ?? 10) * STEP;
                            if (label) {
                                tl.to(label, { "--mask-pos": "100%", duration: span + FADE }, t);
                            }
                            tl.to(node, { "--b": 1, duration: span + FADE }, t);
                            t += span;
                        } else {
                            tl.to(node, { opacity: 1, duration: FADE }, t);
                            t += STEP;
                        }
                    });

                    // Brief hold after text reveal completes before expansion begins
                    const HOLD_BEFORE_EXPAND = 0.6;
                    const expandStart = t + FADE + HOLD_BEFORE_EXPAND;

                    // ──── Pill Expansion Phase ────
                    // Each pill grows from text capsule into a visible image container
                    const pills = el.querySelectorAll<HTMLElement>("[data-pill]");
                    const EXPAND_DUR = 0.8;
                    const STAGGER = 0.15;

                    pills.forEach((pill, i) => {
                        const pillImg = pill.querySelector<HTMLElement>("[data-pill-img]");
                        const label = pill.querySelector<HTMLElement>("[data-label]");
                        const pillStart = expandStart + i * STAGGER;

                        // Grow the pill to show the image
                        tl.to(
                            pill,
                            {
                                height: 120,
                                width: 220,
                                padding: 0,
                                duration: EXPAND_DUR,
                                ease: "power2.inOut",
                            },
                            pillStart
                        );

                        // Reveal the full image
                        if (pillImg) {
                            tl.to(
                                pillImg,
                                {
                                    opacity: 1,
                                    duration: EXPAND_DUR * 0.6,
                                    ease: "power2.inOut",
                                },
                                pillStart + EXPAND_DUR * 0.15
                            );
                        }

                        // Fade out the text label
                        if (label) {
                            tl.to(
                                label,
                                {
                                    opacity: 0,
                                    duration: EXPAND_DUR * 0.4,
                                    ease: "power2.in",
                                },
                                pillStart
                            );
                        }
                    });

                    // Hold at expanded state before unpinning
                    const expandEnd = expandStart + pills.length * STAGGER + EXPAND_DUR;
                    tl.to({}, { duration: 0.8 }, expandEnd);
                }, el);

                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            };

            // Build immediately so the pinned spacer is in the DOM in correct order from the start
            build();

            // When web fonts finish loading, rebuild SplitText with final font metrics and refresh triggers
            if (document.fonts?.ready) {
                document.fonts.ready.then(() => {
                    if (!dead) {
                        build();
                    }
                });
            }

            let timer: number;
            const onResize = () => {
                clearTimeout(timer);
                timer = window.setTimeout(() => {
                    if (!dead) {
                        build();
                    }
                }, 200);
            };
            window.addEventListener("resize", onResize);

            return () => {
                dead = true;
                clearTimeout(timer);
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
                    <span data-split>Meet</span>{" "}
                    <Pill id="lamp" />
                    <br className={styles.desktopBr} />
                    <span data-split>Designed to shape the atmosphere</span>
                    <br className={styles.desktopBr} />
                    <span data-split>of your space, Orbita Lamp combines</span>
                    <br className={styles.desktopBr} />
                    <Pill id="timeless" />{" "}
                    <Pill id="intelligent" />{" "}
                    <span data-split>and</span>
                    <br className={styles.desktopBr} />
                    <span data-split>premium</span>{" "}
                    <Pill id="craftsmanship" />{" "}
                    <span data-split>to create an</span>
                    <br className={styles.desktopBr} />
                    <span data-split>experience that goes beyond illumination</span>
                </p>
            </div>
        </section>
    );
}