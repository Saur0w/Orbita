"use client";

import { useRef, useState } from "react";
import styles from "./style.module.scss";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { LogoPaths } from "@/components/Icons/logo";

gsap.registerPlugin(SplitText, CustomEase, useGSAP);

CustomEase.create("wordSplit", "0.22, 1, 0.36, 1");
CustomEase.create("portalZoom", "0.65, 0, 0.25, 1");

interface PreloaderProps {
    onComplete?: () => void;
}

const ICON_VIEWBOX_CENTER = 366.913;
const INITIAL_ICON_SIZE = 56;

export default function Preloader({ onComplete }: PreloaderProps) {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const leftWordRef = useRef<HTMLSpanElement>(null);
    const rightWordRef = useRef<HTMLSpanElement>(null);
    const iconSlotRef = useRef<HTMLSpanElement>(null);
    const maskLogoGroupRef = useRef<SVGGElement>(null);
    const [isDone, setIsDone] = useState(false);

    useGSAP(
        () => {
            const el = preloaderRef.current;
            const leftWord = leftWordRef.current;
            const rightWord = rightWordRef.current;
            const iconSlot = iconSlotRef.current;
            const maskLogo = maskLogoGroupRef.current;

            if (!el || !leftWord || !rightWord || !iconSlot || !maskLogo) return;

            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            const splitLeft = SplitText.create(leftWord, {
                type: "chars",
                charsClass: styles.char,
            });
            const splitRight = SplitText.create(rightWord, {
                type: "chars",
                charsClass: styles.char,
            });
            const allChars = [...splitLeft.chars, ...splitRight.chars];

            const updateMaskCenter = () => {
                const slotRect = iconSlot.getBoundingClientRect();
                const centerX = slotRect.left + slotRect.width / 2;
                const centerY = slotRect.top + slotRect.height / 2;

                gsap.set(maskLogo, {
                    x: centerX - ICON_VIEWBOX_CENTER,
                    y: centerY - ICON_VIEWBOX_CENTER,
                    svgOrigin: `${ICON_VIEWBOX_CENTER} ${ICON_VIEWBOX_CENTER}`,
                });
            };
            updateMaskCenter();

            const baseScale = INITIAL_ICON_SIZE / 730;
            const maxViewportHypotenuse = Math.hypot(
                window.innerWidth,
                window.innerHeight
            );
            const fullRevealScale = (maxViewportHypotenuse / 220) * 1.15;

            gsap.set(allChars, {
                opacity: 0,
                filter: "blur(8px)",
                scale: 0.94,
                transformOrigin: "50% 50%",
            });
            gsap.set([leftWord, rightWord], {
                autoAlpha: 1,
            });

            gsap.set(iconSlot, { width: 0 });
            gsap.set(maskLogo, {
                scale: 0,
                opacity: 1,
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = prevOverflow;
                    setIsDone(true);
                },
            });

            tl.to(allChars, {
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                duration: 0.7,
                stagger: {
                    each: 0.04,
                    from: "random",
                },
                ease: "power2.out",
            });

            const splitStart = "+=0.15";
            tl.to(
                iconSlot,
                {
                    width: INITIAL_ICON_SIZE + 20,
                    duration: 0.85,
                    ease: "wordSplit",
                    onUpdate: updateMaskCenter,
                },
                splitStart
            );

            tl.to(
                maskLogo,
                {
                    scale: baseScale,
                    duration: 0.85,
                    ease: "back.out(1.6)",
                },
                splitStart
            );

            tl.to(
                maskLogo,
                {
                    scale: baseScale * 0.72,
                    duration: 0.25,
                    ease: "power2.inOut",
                },
                "+=0.1"
            );

            tl.to(
                maskLogo,
                {
                    scale: fullRevealScale,
                    duration: 1.3,
                    ease: "portalZoom",
                    onStart: () => {
                        gsap.delayedCall(0.7, () => {
                            onComplete?.();
                        });
                    },
                }
            );

            tl.to(
                [leftWord, rightWord],
                {
                    opacity: 0,
                    duration: 0.25,
                    ease: "power2.in",
                },
                "<"
            );

            window.addEventListener("resize", updateMaskCenter);
            return () => {
                window.removeEventListener("resize", updateMaskCenter);
                document.body.style.overflow = prevOverflow;
                splitLeft.revert();
                splitRight.revert();
            };
        },
        { scope: preloaderRef }
    );

    if (isDone) return null;

    return (
        <div
            ref={preloaderRef}
            className={styles.preloader}
            aria-hidden="true"
        >
            <svg className={styles.maskSvg} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id="orbita-preloader-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <g
                            ref={maskLogoGroupRef}
                            fill="black"
                            className={styles.maskLogo}
                        >
                            <LogoPaths />
                        </g>
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="#F7F1E8"
                    mask="url(#orbita-preloader-mask)"
                />
            </svg>

            <div className={styles.textLayer}>
                <h1 className={styles.brandTitle}>
                    <span
                        ref={leftWordRef}
                        className={`${styles.word} ${styles.leftWord}`}
                    >
                        Orbital
                    </span>
                    <span ref={iconSlotRef} className={styles.iconSlot} />
                    <span
                        ref={rightWordRef}
                        className={`${styles.word} ${styles.rightWord}`}
                    >
                        Lamp
                    </span>
                </h1>
            </div>
        </div>
    );
}