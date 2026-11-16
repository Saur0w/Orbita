"use client";

import styles from "./style.module.scss";
import Image from "next/image";
import { Link } from "next-view-transitions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { useRef, type CSSProperties } from "react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
    CustomEase.create("gridForm", "0.22, 1, 0.36, 1");
    CustomEase.create("sectionTransition", "0.45, 0, 0.25, 1");
}

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

const MOBILE_QUERY = "(max-width: 767px)";

/**
 * The pill <svg><image> was loading the raw JPGs (probably several MB each) and
 * re-sampling them on every scrub frame. This routes them through the Next image
 * optimizer at 640px instead. Set to false if you use a custom loader or
 * `images.unoptimized`.
 */
const OPTIMIZE_PILL_IMAGES = true;
const pillImageSrc = (src: string) =>
    OPTIMIZE_PILL_IMAGES
        ? `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`
        : src;

const PILL_ORIGINS: Record<string, string> = {
    lamp: "56.5% 50%",
    timeless: "45% 50%",
    intelligent: "60.5% 50%",
    craftsmanship: "52% 60%",
};

const CARD_ASPECT_RATIOS: Record<string, number> = {
    lamp: 4096 / 3058,
    timeless: 4096 / 3058,
    intelligent: 4096 / 3072,
    craftsmanship: 4096 / 3058,
};

type Rect = { x: number; y: number; w: number; h: number };

type CardState = {
    cardEl: HTMLElement;
    pillSvg: SVGElement | null;
    pill: Rect;
    mid: Rect;
    final: Rect;
};

function Pill({ id }: { id: string }) {
    const item = cards.find((i) => i.id === id);
    if (!item) return null;

    return (
        <span className={styles.pill} data-pill data-id={id} aria-label={item.alt}>
            <span className={styles.pillGhost} aria-hidden="true">
                {item.title}
            </span>

            <svg className={styles.pillSvg} data-pill-svg aria-hidden="true">
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
                    href={pillImageSrc(item.src)}
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
    const desRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const el = desRef.current;
            if (!el) return;

            let ctx: gsap.Context | undefined;
            let disposed = false;
            let resizeTimer = 0;
            let lastW = window.innerWidth;
            let lastH = window.innerHeight;
            const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

            const measure = (node: HTMLElement, origin: DOMRect): Rect => {
                const r = node.getBoundingClientRect();
                return {
                    x: r.left - origin.left,
                    y: r.top - origin.top,
                    w: r.width,
                    h: r.height,
                };
            };

            const build = () => {
                if (disposed) return;
                ctx?.revert();

                const reduced = window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;
                el.classList.toggle(styles.reduced, reduced);

                ctx = gsap.context(() => {
                    const splitTargets = el.querySelectorAll("[data-split]");
                    if (splitTargets.length > 0) {
                        SplitText.create(splitTargets, {
                            type: "words,chars",
                            charsClass: styles.char,
                        });
                    }

                    if (reduced) {
                        // static layout: letters filled with the image, no scroll animation
                        gsap.set("[data-clip-fill]", { scale: 0 });
                        return;
                    }

                    const contentWrapper = el.querySelector<HTMLElement>(
                        `.${styles.contentWrapper}`
                    );
                    const textContainer = el.querySelector<HTMLElement>(
                        `.${styles.textContainer}`
                    );
                    const gridContainer = el.querySelector<HTMLElement>(
                        `.${styles.gridContainer}`
                    );
                    if (!contentWrapper || !textContainer || !gridContainer) return;

                    const wrapperRect = contentWrapper.getBoundingClientRect();

                    // Initial state
                    gsap.set(`.${styles.char}`, { opacity: DIM_OPACITY });
                    gsap.set("[data-pill-svg]", { opacity: DIM_OPACITY });
                    gsap.set("[data-clip-text]", { scale: 1 });
                    gsap.set("[data-clip-fill]", { scale: 0 });
                    gsap.set("[data-pill]", { borderColor: "rgba(75, 72, 65, 0.15)" });
                    gsap.set(textContainer, { opacity: 1 });
                    gsap.set([`.${styles.cardCaption}`, `.${styles.mobilePreorderCard}`], {
                        opacity: 0,
                        y: 14,
                    });

                    const states: CardState[] = [];

                    cards.forEach((card) => {
                        const cardEl = el.querySelector<HTMLElement>(
                            `[data-card="${card.id}"]`
                        );
                        const pill = el.querySelector<HTMLElement>(
                            `[data-pill][data-id="${card.id}"]`
                        );
                        const midSlot = el.querySelector<HTMLElement>(
                            `[data-mid-target="${card.id}"]`
                        );
                        const targetSlot = el.querySelector<HTMLElement>(
                            `[data-grid-card="${card.id}"] .${styles.cardImageWrapper}`
                        );
                        if (!cardEl || !pill || !midSlot || !targetSlot) return;

                        const state: CardState = {
                            cardEl,
                            pillSvg: pill.querySelector<SVGElement>("[data-pill-svg]"),
                            pill: measure(pill, wrapperRect),
                            mid: measure(midSlot, wrapperRect),
                            final: measure(targetSlot, wrapperRect),
                        };
                        states.push(state);

                        const naturalRatio = CARD_ASPECT_RATIOS[card.id] ?? (4 / 3);
                        const targetW = Math.max(state.mid.w, state.final.w);
                        const targetH = Math.max(state.mid.h, state.final.h);

                        let imgW = targetW;
                        let imgH = targetW / naturalRatio;
                        if (imgH < targetH) {
                            imgH = targetH;
                            imgW = targetH * naturalRatio;
                        }

                        const imgInner = cardEl.querySelector<HTMLElement>(
                            `[data-img-inner="${card.id}"]`
                        );
                        if (imgInner) {
                            gsap.set(imgInner, {
                                width: Math.ceil(imgW),
                                height: Math.ceil(imgH),
                            });
                        }

                        gsap.set(cardEl, {
                            x: state.pill.x,
                            y: state.pill.y,
                            width: state.pill.w,
                            height: state.pill.h,
                            borderRadius: 58,
                            opacity: 0,
                        });
                    });

                    const tl = gsap.timeline({
                        defaults: { ease: "none" },
                        scrollTrigger: {
                            trigger: textContainer,
                            start: "top top",
                            end: "+=500%",
                            pin: el,
                            pinSpacing: true,
                            scrub: 0.6,
                            anticipatePin: 1,
                        },
                    });

                    // text reveal
                    let cursor = 0;
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
                                { borderColor: "rgba(35, 35, 35, 0.45)", duration: pillDuration },
                                cursor
                            );
                            if (svg) {
                                tl.to(svg, { opacity: 1, duration: pillDuration }, cursor);
                            }
                            cursor += charCount * CHAR_STEP;
                        } else {
                            tl.to(node, { opacity: 1, duration: FADE_DUR }, cursor);
                            cursor += CHAR_STEP;
                        }
                    });

                    // Pills fill with their image
                    const PAUSE_BEFORE_ZOOM = 0.35;
                    const zoomStart = cursor + FADE_DUR + PAUSE_BEFORE_ZOOM;
                    const pills = el.querySelectorAll<HTMLElement>("[data-pill]");
                    const ZOOM_DUR = 4.8;
                    const ZOOM_STAGGER = 0.22;

                    pills.forEach((pill, index) => {
                        const origin = PILL_ORIGINS[pill.dataset.id ?? ""] ?? "50% 50%";
                        const clipText = pill.querySelector<SVGTextElement>("[data-clip-text]");
                        const clipFill = pill.querySelector<SVGRectElement>("[data-clip-fill]");
                        const start = zoomStart + index * ZOOM_STAGGER;
                        if (!clipText || !clipFill) return;

                        tl.fromTo(
                            clipText,
                            { scale: 1, transformOrigin: origin },
                            {
                                scale: 150,
                                transformOrigin: origin,
                                duration: ZOOM_DUR,
                                ease: "power2.inOut",
                            },
                            start
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
                            start + ZOOM_DUR * 0.15
                        );
                    });

                    const zoomEnd = zoomStart + (pills.length - 1) * ZOOM_STAGGER + ZOOM_DUR;

                    // mid 2x2 grid
                    const PAUSE_BEFORE_SUCK = 0.25;
                    const gridStart = zoomEnd + PAUSE_BEFORE_SUCK;
                    const MID_DUR = 2.8;
                    const SUCK_STAGGER = 0.08;

                    tl.to(
                        textContainer,
                        { opacity: 0.35, duration: MID_DUR * 0.7, ease: "power2.inOut" },
                        gridStart
                    );

                    states.forEach((s, index) => {
                        const t = gridStart + index * SUCK_STAGGER;

                        tl.set(s.cardEl, { opacity: 1 }, t);
                        if (s.pillSvg) tl.set(s.pillSvg, { opacity: 0 }, t);

                        tl.fromTo(
                            s.cardEl,
                            {
                                x: s.pill.x,
                                y: s.pill.y,
                                width: s.pill.w,
                                height: s.pill.h,
                                borderRadius: 58,
                            },
                            {
                                x: s.mid.x,
                                y: s.mid.y,
                                width: s.mid.w,
                                height: s.mid.h,
                                borderRadius: 8,
                                duration: MID_DUR,
                                ease: "gridForm",
                                immediateRender: false,
                            },
                            t
                        );
                    });

                    const midGridEnd = gridStart + (states.length - 1) * SUCK_STAGGER + MID_DUR;
                    const HOLD_MID_DUR = 0.85;
                    const finalStart = midGridEnd + HOLD_MID_DUR;
                    const FINAL_DUR = 3.2;
                    const FINAL_STAGGER = 0;

                    states.forEach((s, index) => {
                        tl.fromTo(
                            s.cardEl,
                            {
                                x: s.mid.x,
                                y: s.mid.y,
                                width: s.mid.w,
                                height: s.mid.h,
                                borderRadius: 8,
                            },
                            {
                                x: s.final.x,
                                y: s.final.y,
                                width: s.final.w,
                                height: s.final.h,
                                borderRadius: 8,
                                duration: FINAL_DUR,
                                ease: "sectionTransition",
                                immediateRender: false,
                            },
                            finalStart + index * FINAL_STAGGER
                        );
                    });

                    tl.to(
                        [`.${styles.cardCaption}`, `.${styles.mobilePreorderCard}`],
                        {
                            opacity: 1,
                            y: 0,
                            stagger: 0.08,
                            duration: 0.65,
                            ease: "power2.out",
                        },
                        finalStart + FINAL_DUR * 0.6
                    );

                    const totalEnd = finalStart + (states.length - 1) * FINAL_STAGGER + FINAL_DUR;
                    tl.to({}, { duration: 0.2 }, totalEnd);
                }, el);

                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            };

            build();

            if (document.fonts && document.fonts.status !== "loaded") {
                document.fonts.ready.then(() => build());
            }

            const onResize = () => {
                window.clearTimeout(resizeTimer);
                resizeTimer = window.setTimeout(() => {
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    const widthChanged = w !== lastW;
                    const heightChanged = !coarsePointer && h !== lastH;
                    if (!widthChanged && !heightChanged) return;
                    lastW = w;
                    lastH = h;
                    build();
                }, 250);
            };
            window.addEventListener("resize", onResize);

            return () => {
                disposed = true;
                window.clearTimeout(resizeTimer);
                window.removeEventListener("resize", onResize);
                ctx?.revert();
                el.classList.remove(styles.reduced);
            };
        },
        { scope: desRef }
    );

    return (
        <section className={styles.des} ref={desRef} id="the-lamp">
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
                                <div
                                    className={styles.cardImageWrapper}
                                    style={{ "--img": `url(${card.src})` } as CSSProperties}
                                />
                                <span className={styles.cardCaption}>{card.caption}</span>
                            </div>
                        ))}

                        <div className={styles.mobilePreorderCard}>
                            <div className={styles.mobilePreorderThumbWrapper}>
                                <Image
                                    src="/images/lamp.jpg"
                                    alt="Orbita Lamp preview"
                                    fill
                                    loading="eager"
                                    sizes="(max-width: 768px) 50vw, 250px"
                                    className={styles.mobilePreorderThumb}
                                />
                            </div>
                            <Link href="/preorder" className={styles.mobilePreorderBtn}>
                                Pre-order now
                            </Link>
                        </div>
                    </div>
                </section>

                <div className={styles.cardsOverlay} aria-hidden="true">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className={styles.floatingCard}
                            data-card={card.id}
                        >
                            <div
                                className={styles.imageInner}
                                data-img-inner={card.id}
                            >
                                <Image
                                    src={card.src}
                                    alt={card.alt}
                                    fill
                                    loading="eager"
                                    sizes="(max-width: 768px) 90vw, 55vw"
                                    className={styles.cardImage}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}