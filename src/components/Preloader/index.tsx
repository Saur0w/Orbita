"use client";

import { useId, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { LogoPaths } from "@/components/Icons/logo";
import styles from "./style.module.scss";

gsap.registerPlugin(SplitText, CustomEase, useGSAP);

CustomEase.create("wordSplit", "0.22, 1, 0.36, 1");
CustomEase.create("iconPop", "0.34, 1.35, 0.64, 1");
CustomEase.create("portalZoom", "0.72, 0, 0.2, 1");

interface PreloaderProps {
    onComplete?: () => void;
    onStartReveal?: () => void;
}


const VIEWBOX = 730;
const VIEWBOX_CENTER = 366.913;
const CORE_DIAMETER = 220;
const ICON_EM = 1.04;
const SLOT_GAP_EM = 1.32;

export default function Preloader({ onComplete, onStartReveal }: PreloaderProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const leftWordRef = useRef<HTMLSpanElement>(null);
    const rightWordRef = useRef<HTMLSpanElement>(null);
    const iconSlotRef = useRef<HTMLSpanElement>(null);
    const logoRef = useRef<SVGGElement>(null);
    const [isDone, setIsDone] = useState(false);

    const maskId = `preloader-mask-${useId().replace(/:/g, "")}`;

    useGSAP(
        () => {
            const root = rootRef.current;
            const title = titleRef.current;
            const leftWord = leftWordRef.current;
            const rightWord = rightWordRef.current;
            const iconSlot = iconSlotRef.current;
            const logo = logoRef.current;
            if (!root || !title || !leftWord || !rightWord || !iconSlot || !logo) return;

            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            const restoreScroll = () => {
                document.body.style.overflow = prevOverflow;
            };

            const startReveal = () => {
                onStartReveal?.();
                window.dispatchEvent(new CustomEvent("orbita:portal-open"));
            };
            const finish = () => {
                restoreScroll();
                setIsDone(true);
            };

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                gsap.set([leftWord, rightWord], { autoAlpha: 1 });
                gsap.timeline({ delay: 0.6, onComplete: finish })
                    .call(startReveal)
                    .to(root, { autoAlpha: 0, duration: 0.5, ease: "power1.out" })
                    .call(() => onComplete?.(), undefined, "<0.3");
                return restoreScroll;
            }

            const splits = [leftWord, rightWord].map((word) =>
                SplitText.create(word, { type: "chars", charsClass: styles.char })
            );
            const shuffledChars = gsap.utils.shuffle(splits.flatMap((s) => s.chars));

            const setLeftX = gsap.quickSetter(leftWord, "x", "px");
            const setRightX = gsap.quickSetter(rightWord, "x", "px");
            const p = { slot: 0, k: 0, pull: 0 };
            const m = { fs: 48, cx: 0, cy: 0, shift: 0 };

            const measure = () => {
                m.fs = parseFloat(getComputedStyle(title).fontSize) || 48;
                const r = iconSlot.getBoundingClientRect();
                m.cx = r.left + r.width / 2;
                m.cy = r.top + r.height / 2;
                m.shift = (leftWord.offsetWidth - rightWord.offsetWidth) / 2;
            };

            const render = () => {
                const iconSize = m.fs * ICON_EM;
                const halfGap = (m.fs * SLOT_GAP_EM * 0.5) * p.slot;
                const pressPull = m.fs * 0.06 * p.pull;
                const centerShift = m.shift * (1 - p.slot);

                setLeftX(centerShift - halfGap + pressPull);
                setRightX(centerShift + halfGap - pressPull);

                gsap.set(logo, {
                    x: m.cx + centerShift - VIEWBOX_CENTER,
                    y: m.cy - VIEWBOX_CENTER,
                    scale: p.k * (iconSize / VIEWBOX),
                });
            };

            const portalScale = () => {
                const base = (m.fs * ICON_EM) / VIEWBOX;
                const needed =
                    (Math.hypot(window.innerWidth, window.innerHeight) * 1.15) /
                    CORE_DIAMETER;
                return needed / base;
            };

            measure();
            const initialBlur = Math.max(12, Math.round(m.fs * 0.32));

            gsap.set(logo, {
                opacity: 1,
                svgOrigin: `${VIEWBOX_CENTER} ${VIEWBOX_CENTER}`,
            });
            gsap.set(shuffledChars, {
                opacity: 0,
                filter: `blur(${initialBlur}px)`,
                scale: 0.95,
                transformOrigin: "50% 50%",
                force3D: true,
            });
            gsap.set([leftWord, rightWord], { autoAlpha: 1, force3D: true });
            render();

            const tl = gsap.timeline({
                paused: true,
                onComplete: finish,
            });

            tl.to(
                shuffledChars,
                {
                    opacity: 1,
                    duration: 0.62,
                    stagger: 0.055,
                    ease: "power2.out",
                },
                0.15
            ).to(
                shuffledChars,
                {
                    filter: "blur(0px)",
                    scale: 1,
                    duration: 1.15,
                    stagger: 0.055,
                    ease: "power3.out",
                    onComplete: () => {
                        gsap.set(shuffledChars, { clearProps: "filter,willChange" });
                    },
                },
                0.15
            );

            tl.addLabel("split", "+=0.18");
            tl.to(
                p,
                {
                    slot: 1,
                    duration: 0.82,
                    ease: "wordSplit",
                    onUpdate: render,
                },
                "split"
            );
            tl.to(
                p,
                {
                    k: 1,
                    duration: 0.76,
                    ease: "iconPop",
                    onUpdate: render,
                },
                "split+=0.06"
            );

            tl.addLabel("press", "+=0.28");
            tl.to(
                p,
                {
                    k: 0.72,
                    pull: 1,
                    duration: 0.25,
                    ease: "power2.out",
                    onUpdate: render,
                },
                "press"
            );

            tl.addLabel("portal", ">+0.06");
            tl.to(
                p,
                {
                    k: portalScale,
                    pull: 0,
                    duration: 1.25,
                    ease: "portalZoom",
                    onUpdate: render,
                },
                "portal"
            );
            tl.to(
                [leftWord, rightWord],
                {
                    opacity: 0,
                    filter: "blur(6px)",
                     duration: 0.24,
                    ease: "power2.inOut",
                },
                "portal+=0.12"
            );
            tl.call(startReveal, undefined, "portal");
            tl.call(() => onComplete?.(), undefined, "portal+=0.68");

            let cancelled = false;
            const relayout = () => {
                measure();
                render();
            };
            const start = () => {
                if (cancelled) return;
                relayout();
                tl.play();
            };
            if (document.fonts?.ready) document.fonts.ready.then(start);
            else start();

            window.addEventListener("resize", relayout, { passive: true });

            return () => {
                cancelled = true;
                window.removeEventListener("resize", relayout);
                restoreScroll();
                splits.forEach((s) => s.revert());
            };
        },
        { scope: rootRef }
    );

    if (isDone) return null;

    return (
        <div ref={rootRef} className={styles.preloader} aria-hidden="true">
            <svg className={styles.maskSvg} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask
                        id={maskId}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                    >
                        <rect width="100%" height="100%" fill="white" />
                        <g ref={logoRef} fill="black" className={styles.maskLogo}>
                            <LogoPaths />
                        </g>
                    </mask>
                </defs>
                <rect
                    className={styles.panel}
                    width="100%"
                    height="100%"
                    mask={`url(#${maskId})`}
                />
            </svg>

            <div className={styles.textLayer}>
                <h1 ref={titleRef} className={styles.brandTitle}>
                    <span ref={leftWordRef} className={`${styles.word} ${styles.leftWord}`}>
                        Orbital
                    </span>
                    <span ref={iconSlotRef} className={styles.iconSlot} />
                    <span ref={rightWordRef} className={`${styles.word} ${styles.rightWord}`}>
                        Lamp
                    </span>
                </h1>
            </div>
        </div>
    );
}